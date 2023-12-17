import { Vec2, Vec4, mat4, quat, vec2, vec3, vec4 } from "wgpu-matrix";
import Mesh from "../Drawables/Mesh";
import { box } from "../Drawables/Shapes/box";
import SceneNode from "../Drawables/SceneNode";
import { anglesOfLaunch, degToRad, minimumVelocity, timeToTarget } from "../Math";
import Circle from "../Drawables/Circle";
import RenderPass from "../RenderPass";
import { ActorInterface } from "../ActorInterface";
import Shot, { ShotData } from "../Shot";
import { playShot } from "../Audio";
import { WorldInterface } from "../WorldInterface";
import { Action, ActionType, Key } from "../Worker/QStore";
import { weaponDamage } from "./Equipment/Weapon";
import Character from "./Character";
import { attackRoll } from "../Dice";
import { qStore, workerQueue } from "../WorkerQueue";

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
  character: Character;

  team: number;

  automated: boolean;

  moveTo: Vec2 | null = null;

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
    character: Character,
    mesh: SceneNode,
    height: number,
    color: Vec4,
    team: number,
    automated: boolean,
  ) {
    this.character = character;
    this.team = team;
    this.automated = automated;
    this.mesh = mesh;
    this.height = height;
    this.chestHeight = height - 0.5;
    this.teamColor = color;

    const q = quat.fromEuler(degToRad(270), 0, 0, "xyz");

    this.circle = new Circle(1, 0.025, color);
    this.circle.postTransforms.push(mat4.fromQuat(q));
  }

  static async create(
    character: Character, color: Vec4, teamColor: Vec4, team: number, automated: boolean,
  ) {
    const playerWidth = 1;
    const playerHeight = 1.75;

    const mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, color))
    mesh.translate[1] = playerHeight / 2;  

    return new Actor(character, mesh, playerHeight, teamColor, team, automated);
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
    action: Action | null, otherTeam: Actor[], timestamp: number, world: WorldInterface,
  ): Actor[] {
    const epsilon = 0.02; // Probability of a random action

    if (action === null || Math.random() < epsilon) {
      const actionType = Math.trunc(Math.random() * 3);

      action = {
        type: ['HitPoints', 'ArmorClass', 'Weapon'][actionType] as ActionType,
        opponent: Math.trunc(Math.random() * otherTeam.length),
      }
    }

    let sortedActors: Actor[] = [];

    switch (action.type) {
      case 'HitPoints':
        sortedActors = otherTeam.map((a) => a).sort((a, b) => a.character.hitPoints - b.character.hitPoints);
        break;

      case 'ArmorClass':
        sortedActors = otherTeam.map((a) => a).sort((a, b) => a.character.armorClass - b.character.armorClass);
        break;

      case 'Weapon':
        sortedActors = otherTeam.map((a) => a).sort((a, b) => {
          const damageA = ((a.character.equipped.meleeWeapon!.die[0].die + 1) / 2) * a.character.equipped.meleeWeapon!.die[0].numDice
          const damageB = ((b.character.equipped.meleeWeapon!.die[0].die + 1) / 2) * b.character.equipped.meleeWeapon!.die[0].numDice
          return damageA - damageB
        });
        break;

      default:
        console.log('action type not handled')
    }

    const target = sortedActors[action.opponent];
    const result = this.attack(target, timestamp, world);

    return result.removedActors;
  }

  chooseAction(timestamp: number, world: WorldInterface): Actor[] {
    let removedActors: Actor[] = [];
  
    const otherTeam = world.participants.participants[this.team ^ 1];
    
    if (otherTeam.length > 0) {
      let action: Action | null = null;

      if (this.team === 1 && qStore.store.size > 0) {
        const state: Key = {
          opponent: otherTeam.map((t) => ({
            hitPoints: t.character.hitPoints,
            weapon: ((t.character.equipped.meleeWeapon!.die[0].die + 1) / 2) * t.character.equipped.meleeWeapon!.die[0].numDice,
            armorClass: t.character.armorClass,
          })),
        };

        action = qStore.getBestAction(state);

        if (action === null) {
          console.log(`No best action for ${JSON.stringify(state)}`)
          // worker.postMessage({
          //   type: 'ammend',
          //   parties: characterStorageParties(world.participants.parties),
          // });
          workerQueue.update(world.participants.parties)
        }
        else {
          console.log(`${action.type}, ${action.opponent}`)
        }
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

    if (this.character.equipped.meleeWeapon) {
      const roll = attackRoll(targetActor.character.armorClass, this.character.abilityScores.dexterity);

      if (roll === 'Hit' || roll === 'Critical') {
        let damage = weaponDamage(this.character.equipped.meleeWeapon, this.character.abilityScores, false);
  
        if (roll === 'Critical') {
          damage = weaponDamage(this.character.equipped.meleeWeapon, this.character.abilityScores, false);
        }
  
        targetActor.character.hitPoints -= damage;
  
        if (targetActor.character.hitPoints <= 0) {
          targetActor.character.hitPoints = 0;
  
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

