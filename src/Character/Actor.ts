import { Vec2, Vec4, mat4, quat, vec2, vec3, vec4 } from "wgpu-matrix";
import Mesh from "../Drawables/Mesh";
import { box } from "../Drawables/Shapes/box";
import SceneNode from "../Drawables/SceneNode";
import { anglesOfLaunch, degToRad, minimumVelocity, timeToTarget } from "../Math";
import Circle from "../Drawables/Circle";
import { abilityModifier, abilityRoll, attackRoll } from "../Dice";
import RenderPass from "../RenderPass";
import { ActorInterface } from "../ActorInterface";
import Shot, { ShotData } from "../Shot";
import { playShot } from "../Audio";
import { WorldInterface } from "../WorldInterface";
import QStore, { QTable } from "../Worker/QStore";
import { AbilityScores } from "./Races/AbilityScores";
import Human from "./Races/Human";
import Fighter from "./Classes/Fighter";
import { getWeapon, weaponDamage } from "./Equipment/Weapon";

export const qStore = new QStore();

export const worker = new Worker(new URL("../Worker/worker.ts", import.meta.url));

export type WorkerMessage = {
  type: 'Rewards' | 'QTable' | 'Finished',
  rewards?: number[][],
  qtable?: QTable,
}

worker.addEventListener('message', (evt: MessageEvent<WorkerMessage>) => {
  if (evt.data.type === 'QTable' && evt.data.qtable) {
    qStore.store = evt.data.qtable;
  }
})

export type EpisodeInfo = {
  winningTeam: number,
}

enum States {
  idle,
  waitingForCamera,
  attacking,
  postAttack,
}

type Pause = {
  startTime: number,
  duration: number,
}

class Actor implements ActorInterface {
  name: string;

  race = new Human();

  class = new Fighter();

  weapon = getWeapon('Shortbow');

  get armorClass() {
    return this.class.unarmoredDefence(this.abilityScores);
  };

  abilityScores: AbilityScores;

  team: number;

  automated: boolean;

  moveTo: Vec2 | null = null;

  hitPoints: number;

  metersPerSecond = 2;

  actionsLeft = 0;

  distanceLeft = 0;

  turnDuration = 6;

  height = 1.75;

  chestHeight = 1.45;

  mesh: SceneNode;

  circle: Circle;

  teamColor: Vec4;

  initiativeRoll = 0;

  renderPass: RenderPass | null = null;

  state = States.idle;

  pause: Pause | null = null;

  private constructor(
    name: string,
    mesh: SceneNode,
    height: number,
    color: Vec4,
    team: number,
    automated: boolean,
  ) {
    this.name = name;
    this.team = team;
    this.automated = automated;
    this.mesh = mesh;
    this.height = height;
    this.chestHeight = height - 0.5;
    this.teamColor = color;

    const q = quat.fromEuler(degToRad(270), 0, 0, "xyz");

    this.circle = new Circle(1, 0.025, color);
    this.circle.postTransforms.push(mat4.fromQuat(q));

    this.abilityScores = this.assignAbilityScores()

    this.hitPoints = this.class.hitDice + abilityModifier(this.abilityScores.constitution);
  }

  static async create(
    name: string, color: Vec4, teamColor: Vec4, team: number, automated: boolean,
  ) {
    const playerWidth = 1;
    const playerHeight = 1.75;

    const mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, color))
    mesh.translate[1] = playerHeight / 2;  

    return new Actor(name, mesh, playerHeight, teamColor, team, automated);
  }

  assignAbilityScores(): AbilityScores {
    const abilities: AbilityScores = {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    }

    // Roll the dice six times
    let rolls = [
      abilityRoll(),
      abilityRoll(),
      abilityRoll(),
      abilityRoll(),
      abilityRoll(),
      abilityRoll(),
    ]

    const getMaxIndex = (r: number[]) => {
      const max = r.reduce((indexMax, _, index) => {
        if (index === 0) {
          return indexMax
        }
  
        return r[indexMax] < r[index] ? index : indexMax
      }, 0)

      return max;
    }
    
    // Assign the highest dice to the characters class's primary abilities
    for (const ability of this.class.primaryAbilities) {
      const max = getMaxIndex(rolls);

      abilities[ability as keyof AbilityScores] = rolls[max] + this.race.abilityIncrease[ability as keyof AbilityScores];

      rolls = [
        ...rolls.slice(0, max),
        ...rolls.slice(max + 1),
      ]
    }

    // Assign the remaining rolls to the unassigned abilities
    let index = 0;
    for (const [key, value] of Object.entries(abilities)) {
      if (value === 0) {
        abilities[key as keyof AbilityScores] = rolls[index] + this.race.abilityIncrease[key as keyof AbilityScores]
        index += 1;
      }
    }

    return abilities;
  }

  getWorldPosition() {
    // Transforms the position to world space.
    return vec4.transformMat4(
      vec4.create(0, 0, 0, 1),
      this.mesh.transform,
    );    
  }

  startTurn(timestamp: number, world: WorldInterface) {
    this.actionsLeft = 1;

    this.distanceLeft = this.metersPerSecond * this.turnDuration;

    this.circle.color[0] = 1;
    this.circle.color[1] = 1;
    this.circle.color[2] = 1;
    this.circle.color[3] = 1;

    this.state = States.waitingForCamera;
    // this.pause = { startTime: timestamp, duration: 2000 }
    this.pause = { startTime: timestamp, duration: 0 }
  }

  endTurn() {
    this.circle.color[0] = this.teamColor[0];
    this.circle.color[1] = this.teamColor[1];
    this.circle.color[2] = this.teamColor[2];
    this.circle.color[3] = this.teamColor[3];

    this.state = States.idle;
  }

  nextState(state: number) {

  }

  addToScene(renderPass: RenderPass) {
    this.renderPass = renderPass;
    this.renderPass.addDrawable(this.mesh, 'lit');
    this.renderPass.addDrawable(this.circle, 'circle');
  }

  removeFromScene() {
    if (this.renderPass) {
      this.renderPass.removeDrawable(this.mesh, 'lit');
      this.renderPass.removeDrawable(this.circle, 'circle');  
    }
  }

  move(elapsedTime: number) {
    if (this.moveTo) {
      const distanceToTarget = vec2.distance(
        vec2.create(
          this.mesh.translate[0],
          this.mesh.translate[2],
        ),
        this.moveTo,
      );

      if (this.metersPerSecond * elapsedTime > distanceToTarget) {
        this.mesh.translate[0] = this.moveTo[0];
        this.mesh.translate[2] = this.moveTo[1];

        this.circle.translate = vec3.copy(this.mesh.translate);
        this.circle.translate[1] = 0;

        this.moveTo = null;
      } else {
        let v = vec3.create(
          this.moveTo[0] - this.mesh.translate[0],
          0,
          this.moveTo[1] - this.mesh.translate[2],
        );

        v = vec3.normalize(v);

        v = vec3.mulScalar(v, elapsedTime * this.metersPerSecond);

        this.mesh.translate[0] += v[0];
        this.mesh.translate[2] += v[2];

        this.circle.translate = vec3.copy(this.mesh.translate);
        this.circle.translate[1] = 0;
      }
    }
  }

  takeAction(
    action: number | null, otherTeam: Actor[], timestamp: number, world: WorldInterface,
  ): Actor[] {
    const epsilon = 0.02; // Probability of a random action

    if (action === null || Math.random() < epsilon) {
      action = Math.trunc(Math.random() * otherTeam.length);
    }

    const sortedActors = otherTeam.map((a) => a).sort((a, b) => a.hitPoints - b.hitPoints);

    const target = sortedActors[action];
    const result = this.attack(target, timestamp, world);

    return result.removedActors;
  }

  chooseAction(timestamp: number, world: WorldInterface): Actor[] {
    let removedActors: Actor[] = [];
  
    const otherTeam = world.participants.participants[this.team ^ 1];
    
    if (otherTeam.length > 0) {
      let action: number | null = null;

      if (this.team === 1) {
        const state = {
          opponents: otherTeam.map((t) => t.hitPoints),
        };

        action = qStore.getBestAction(state);
      }

      removedActors = this.takeAction(action, otherTeam, timestamp, world);
    }

    return removedActors;
  }

  update(elapsedTime: number, timestamp: number, world: WorldInterface): ActorInterface[] {
    let removedActors: ActorInterface[] = [];

    this.move(elapsedTime)

    if (world.participants.activeActor === this) {
      // if (this.actionsLeft) {
        if (world.animate) {
          if (this.pause && this.pause.startTime + this.pause.duration > timestamp) {
            return [];
          }

          switch (this.state) {
            case States.idle:
              break;
    
            case States.waitingForCamera:
              if (this.actionsLeft) {
                removedActors = this.chooseAction(timestamp, world);
                this.state = States.attacking;
              }
              else {
                this.state = States.idle;
              }
    
              break;
    
            case States.attacking:
              break;
    
            case States.postAttack:
              world.endTurn2(timestamp);  
              break;
          }  
        }
        else {
          removedActors = this.chooseAction(timestamp, world);
          world.endTurn2(timestamp);
        }
      // }
    }

    return removedActors;
  }

  addShot(targetActor: Actor, timestamp: number, world: WorldInterface) {
    const result = this.computeShotData(targetActor);

    const data: ShotData = {
      velocityVector: result.velocityVector,
      orientation: result.orientation,
      startPos: result.startPos,
      position: result.startPos,
      startTime: timestamp,
    };

    let onFinish = (timestamp: number) => {}

    if (this.automated) {
      onFinish = (timestamp: number) => {
        this.state = States.postAttack;
        // this.pause = { startTime: timestamp, duration: 3000 }
        this.pause = { startTime: timestamp, duration: 0 }
      }
    }

    const shot = new Shot(timestamp, onFinish, world.shot, this, data);
    world.actors.push(shot);

    if (this.renderPass) {
      shot.addToScene(this.renderPass);
    }

    // Transforms the position to world space.
    const emitterPosition = vec4.transformMat4(
      vec4.create(0, this.chestHeight, 0, 1),
      this.mesh.transform,
    );

    playShot(emitterPosition);

    // Remove any previously drawn trajectory.
    // if (this.trajectory) {
    //   this.mainRenderPass.removeDrawable(this.trajectory, 'trajectory');
    //   this.trajectory = null;
    // }
  }

  attack(targetActor: Actor, timestamp: number, world: WorldInterface): { removedActors: Actor[] } {
    if (world.animate) {
      this.addShot(targetActor, timestamp, world)
    }

    this.actionsLeft -= 1;

    const removedActors: Actor[] = [];

    const roll = attackRoll(targetActor.armorClass, this.abilityScores.dexterity);

    if (this.weapon) {
      if (roll === 'Hit' || roll === 'Critical') {
        let damage = weaponDamage(this.weapon, this.abilityScores, false);
  
        if (roll === 'Critical') {
          damage = weaponDamage(this.weapon, this.abilityScores, false);
        }
  
        targetActor.hitPoints -= damage;
  
        if (targetActor.hitPoints <= 0) {
          targetActor.hitPoints = 0;
  
          if (!world.animate) {
            world.participants.remove(targetActor);
            removedActors.push(targetActor);
            world.collidees.remove(targetActor);
            targetActor.removeFromScene();
            world.scene.removeNode(targetActor.mesh);
            world.scene.removeNode(targetActor.circle);    
          }
        }
      }  
    }

    return {
      removedActors,
    }
  }

  computeShotData(targetActor: Actor) {
    // Transforms the position to world space.
    const target = vec4.transformMat4(
      vec4.create(0, 0, 0, 1),
      targetActor.mesh.transform,
    );
    target[1] = targetActor.chestHeight;

    const startPos = vec4.transformMat4(
      vec4.create(0, 0, 0, 1),
      this.mesh.transform,
    );
    startPos[1] = this.chestHeight;

    const distance = vec2.distance(
      vec2.create(startPos[0], startPos[2]),
      vec2.create(target[0], target[2]),
    );

    // The endY is the negative height of the launcher.
    const minVelocity = minimumVelocity(distance, target[1] - startPos[1]);

    const velocity = Math.max(50, minVelocity);

    const [lowAngle] = anglesOfLaunch(velocity, distance, target[1] - startPos[1]);

    const timeLow = timeToTarget(distance, velocity, lowAngle);

    const angle = Math.atan2(target[0] - this.mesh.translate[0], target[2] - this.mesh.translate[2]);
    const rotate = mat4.rotationY(angle);

    const orientation = vec3.normalize(vec4.transformMat4(vec4.create(0, 0, 1, 0), rotate));
    orientation[3] = 0;

    return ({
      velocityVector: vec2.create(velocity * Math.cos(lowAngle), velocity * Math.sin(lowAngle)),
      startTime: null, // start time will be assigned at the next frame.
      duration: timeLow,
      startPos,
      orientation,
      distance,
    });
  }
}

export default Actor;

