import { Vec4, mat4, quat, vec2, vec3, vec4 } from "wgpu-matrix";
import Mesh from "../Drawables/Mesh";
import { box } from "../Drawables/Shapes/box";
import SceneNode from "../Drawables/SceneNode";
import { anglesOfLaunch, degToRad, feetToMeters, minimumVelocity, timeToTarget } from "../Math";
import Circle from "../Drawables/Circle";
import RenderPass from "../RenderPass";
import { ActorInterface } from "../ActorInterface";
import Shot, { ShotData } from "../Script/Shot";
import { playShot } from "../Audio";
import { WorldInterface } from "../WorldInterface";
import { Action, Key } from "../Workers/QStore";
import { Advantage, attackRoll } from "../Dice";
import { qStore, workerQueue } from "../WorkerQueue";
import Mover from "../Script/Mover";
import Script from "../Script/Script";
import Weapon, { DamageType, WeaponType } from "./Equipment/Weapon";
import ContainerNode from "../Drawables/ContainerNode";
import Logger from "../Script/Logger";
import Remover from "../Script/Remover";
import Delay from "../Script/Delay";
import FollowPath from "../Script/FollowPath";
import JumpPointSearch from "../Search/JumpPointSearch";
import UniformGridSearch from "../Search/UniformGridSearch";
import { findPath2, getOccupants } from "../Workers/PathPlannerQueue";
import Creature from "./Creature";
import MeleeAttack from "./Actions/MeleeAttack";
import RangeAttack from "./Actions/RangeAttack";
import Charmed from "./Actions/Conditions/Charmed";

// let findPathPromise: {
//   resolve: ((value: [Vec2[], number, number[][]]) => void),
// } | null = null

export const pathFinder: UniformGridSearch = new JumpPointSearch(512, 512, 16);

const pointActors = false;

export type EpisodeInfo = {
  winningTeam: number,
}

export enum States {
  idle,
  planning,
  scripting,
}

class Actor implements ActorInterface {
  character: Creature;

  team: number;

  automated: boolean;

  metersPerSecond = 2;

  distanceLeft = 0;

  turnDuration = 6;

  height = 1.75;

  chestHeight = 1.45;

  occupiedRadius = feetToMeters(2.5);

  attackRadius = this.occupiedRadius + feetToMeters(0.8);

  sceneNode = new ContainerNode();

  circle: Circle;

  outerCircle: Circle;

  teamColor: Vec4;

  initiativeRoll = 0;

  renderPass: RenderPass | null = null;

  state = States.idle;

  private constructor(
    character: Creature,
    mesh: SceneNode,
    height: number,
    color: Vec4,
    team: number,
    automated: boolean,
  ) {
    this.character = character;
    this.team = team;
    this.automated = automated;
    this.sceneNode.addNode(mesh, 'lit');
    this.height = height;
    this.chestHeight = height - 0.5;
    this.teamColor = color;

    this.sceneNode.name = character.name;

    const q = quat.fromEuler(degToRad(270), 0, 0, "xyz");

    this.circle = new Circle(this.occupiedRadius, 0.025, color);
    this.circle.postTransforms.push(mat4.fromQuat(q));

    this.outerCircle = new Circle(this.attackRadius, 0.01, color);
    this.outerCircle.postTransforms.push(mat4.fromQuat(q));

    this.sceneNode.addNode(this.circle, 'circle')
    this.sceneNode.addNode(this.outerCircle, 'circle')
  }

  static async create(
    character: Creature, color: Vec4, teamColor: Vec4, team: number, automated: boolean,
  ) {
    const playerWidth = 1;
    const playerHeight = character.race.height;

    let mesh: Mesh;
    if (pointActors) {
      mesh = await Mesh.create(box(0.125, 0.125, 0.125, vec4.create(1, 1, 1, 1)))
      mesh.translate[1] = 0
    }
    else {
      mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, color))
      mesh.translate[1] = playerHeight / 2;  
    }

    return new Actor(character, mesh, playerHeight, teamColor, team, automated);
  }

  getWorldPosition() {
    // Transforms the position to world space.
    return vec4.transformMat4(
      vec4.create(0, 0, 0, 1),
      this.sceneNode.transform,
    );    
  }

  startTurn(world: WorldInterface) {
    this.character.actionsLeft = 1;
    this.character.bonusActionsLeft = 1;

    this.distanceLeft = this.character.race.speed;

    this.circle.color[0] = 1;
    this.circle.color[1] = 1;
    this.circle.color[2] = 1;
    this.circle.color[3] = 1;

    this.state = States.idle;

    if (!this.automated) {
      this.setDefaultAction();
    }
  }

  setDefaultAction() {
    if (this.character.primaryWeapon === 'Melee') {
      this.character.action = new MeleeAttack();
    }
    else {
      this.character.action = new RangeAttack();
    }
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
    this.renderPass.addDrawables(this.sceneNode);
  }

  removeFromScene() {
    if (this.renderPass) {
      this.renderPass.removeDrawables(this.sceneNode);
    }
  }

  takeAction(
    action: Action | null, otherTeam: Actor[], timestamp: number, world: WorldInterface, script: Script,
  ) {
    const epsilon = 0.02; // Probability of a random action

    if (action === null || Math.random() < epsilon) {
      action = {
        type: 'HitPoints',
        opponent: Math.trunc(Math.random() * otherTeam.length),
      }
    }

    let sortedActors: Actor[] = [];

    sortedActors = otherTeam.map((a) => a).sort((a, b) => {
      if (a.character.hitPoints === b.character.hitPoints) {
        // hit points are equal, sort by armore class

        if (a.character.armorClass === b.character.armorClass) {
          // armor classes are equal so sort by weapon damage
          const damageA = ((a.character.equipped.meleeWeapon!.die[0].die + 1) / 2) * a.character.equipped.meleeWeapon!.die[0].numDice
          const damageB = ((b.character.equipped.meleeWeapon!.die[0].die + 1) / 2) * b.character.equipped.meleeWeapon!.die[0].numDice
          return damageA - damageB
        }

        return a.character.armorClass - b.character.armorClass;
      }

      return a.character.hitPoints - b.character.hitPoints
    });

    const target = sortedActors[action.opponent];
    this.attack(
      target,
      this.character.equipped.meleeWeapon!,
      world,
      script,
    );

    if (this.character.actionsLeft > 0) {
      this.character.actionsLeft -= 1;
    }
  }

  useQLearning = false;

  getTargets(otherTeam: Actor[]) {
    const myPosition = this.getWorldPosition();

    const rankedTargets = otherTeam
      .map((a, index) => ({
        index,
        distance: vec4.distance(myPosition, a.getWorldPosition()),
        point: a.getWorldPosition(),
      }))

    return rankedTargets;
  }

  getDestination(myPosition: Vec4, point: Vec4, distance: number): Vec4 {
    const moveDistance = Math.min(distance, this.character.race.speed)

    const v = vec4.mulScalar(vec4.normalize(vec4.subtract(point, myPosition)), moveDistance);
    return vec4.add(myPosition, v);
  }

  addMove(script: Script, newPos: Vec4) {
    const mover = new Mover(this.sceneNode, vec2.create(newPos[0], newPos[2]));
    script.entries.push(mover);
  }

  async chooseAction(timestamp: number, world: WorldInterface) {
    const otherTeam = world.participants.participants[this.team ^ 1].filter((a) => a.character.hitPoints > 0);
    
    if (otherTeam.length > 0) {
      const script = new Script();

      if (this.useQLearning) {
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
            workerQueue.update(state, world.participants.parties)
          }
        }

        this.takeAction(action, otherTeam, timestamp, world, script);
        this.state = States.scripting;
      }
      else {
        script.entries.push(new Delay(2000));

        const charmed = this.character.getCondition('Charmed') as Charmed;

        let participants = world.participants.turns.filter((a) => a.character.hitPoints > 0);
        const otherTeam = world.participants.participants[this.team ^ 1]
          .filter((a) => (
            a.character.hitPoints > 0
            && !a.character.hasCondition('Sanctuary')
            && (!charmed || charmed.charmer !== a.character)
          ));

        let targets = this.getTargets(otherTeam);
    
        let done = false;
        
        let myPosition = this.getWorldPosition();

        while (!done) {
          if (targets.length === 0) {
            break;
          }
          
          targets.sort((a, b) => a.distance - b.distance)

          // Determine distance to opponents
          const closest = targets[0];
          const target = otherTeam[closest.index];

          if (this.character.actionsLeft > 0) {
            if (closest.distance <= this.attackRadius + target.occupiedRadius) {
              // The target is already in range.
              this.attack(
                target,
                this.character.equipped.meleeWeapon!,
                world,
                script,
              );

              if (this.character.actionsLeft > 0) {
                this.character.actionsLeft -= 1;
              }

              if (target.character.hitPoints === 0) {
                targets = targets.filter((t) => t !== closest);
                participants = participants.filter((t) => t !== target)
              }
              else {
                done = true;
              }
            }
            else {
              // Find path to the closest
              const start = vec2.create(myPosition[0], myPosition[2]);
              const t = target.getWorldPosition();
              const goal = vec2.create(t[0], t[2])

              // if (world.path2) {
              //   world.mainRenderPass.removeDrawable(world.path2, 'line')
              //   world.path2 = null;
              // }

              const occupants = getOccupants(this, target, participants, world.occupants);
              const [path, dist] = await findPath2(this, start, goal, target.occupiedRadius + this.occupiedRadius, target, occupants);
              
              if (this !== world.participants.activeActor) {
                return;
              }

              // world.path2 = new Line(dbl);
              // world.mainRenderPass.addDrawable(world.path2, 'line')

              if (path.length > 0) {
                let distanceToTarget = vec2.distance(path[0], goal);
                distanceToTarget -= target.occupiedRadius

                if (distanceToTarget < this.attackRadius) {
                  script.entries.push(new FollowPath(this.sceneNode, path));  
                  this.distanceLeft -= dist;  
                  myPosition = vec4.create(path[0][0], 0, path[0][1], 1);

                  this.attack(
                    target,
                    this.character.equipped.meleeWeapon!,
                    world,
                    script,
                  );  

                  if (this.character.actionsLeft > 0) {
                    this.character.actionsLeft -= 1;
                  }
    
                  if (target.character.hitPoints === 0) {
                    targets = targets.filter((t) => t !== closest);
                    participants = participants.filter((t) => t !== target)
                  }
                  else {
                    done = true;
                  }
                }
                else {
                  // Moving to towards the target won't get us close enough 
                  // for a melee attack.
                  if (this.character.equipped.rangeWeapon) {
                    const shotData = this.computeShotData(target);
  
                    const data: ShotData = {
                      velocityVector: shotData.velocityVector,
                      orientation: shotData.orientation,
                      startPos: shotData.startPos,
                      position: shotData.startPos,
                    };
  
                    const shot = new Shot(world.shot, this, data);
                    script.entries.push(shot);
  
                    this.attack(
                      target,
                      this.character.equipped.rangeWeapon!,
                      world,
                      script,
                    );
  
                    if (this.character.actionsLeft > 0) {
                      this.character.actionsLeft -= 1;
                    }
      
                    if (target.character.hitPoints === 0) {
                      targets = targets.filter((t) => t !== closest);
                      participants = participants.filter((t) => t !== target)
                      continue;
                    }
                  }
  
                  script.entries.push(new FollowPath(this.sceneNode, path));
                  this.distanceLeft -= dist;  
                  done = true;
                }
              }
              else {
                // Can't find path to target. Try another
                targets = targets.slice(1)
              }
            }
          }
          else {
            // No action to excute but we can move closer to the target if needed.
            if (closest.distance > this.attackRadius + target.occupiedRadius) {
              // Find path to the closest
              const start = vec2.create(myPosition[0], myPosition[2]);
              const t = target.getWorldPosition();
              const goal = vec2.create(t[0], t[2])

              // if (world.path2) {
              //   world.mainRenderPass.removeDrawable(world.path2, 'line')
              //   world.path2 = null;
              // }

              const occupants = getOccupants(this, target, participants, world.occupants);
              const [path, dist] = await findPath2(this, start, goal, target.occupiedRadius + this.occupiedRadius, target, occupants);

              if (this !== world.participants.activeActor) {
                return;
              }

              // world.path2 = new Line(dbl);
              // world.mainRenderPass.addDrawable(world.path2, 'line')

              if (path.length > 0) {
                script.entries.push(new FollowPath(this.sceneNode, path));    
                this.distanceLeft -= dist;  
                done = true;
              }
              else {
                // Can't find path to target. Try another
                targets = targets.slice(1)
              }
            }
            else {
              done = true;
            }
          }
        }

        this.state = States.scripting;
      }

      if (script.entries.length > 0) {
        if (this.automated) {
          script.entries.push(new Delay(2000));

          script.onFinish = (timestamp: number) => {
            world.endTurn2(this);  
          }
        }

        world.actors.push(script);
      }
    }
    else {
      world.endTurn2(this);
    }
  }

  update(elapsedTime: number, timestamp: number, world: WorldInterface): boolean {
    if (this.automated) {
      if (this.character.hitPoints > 0) {
        if (world.participants.activeActor === this) {
          // if (this.actionsLeft) {
            if (world.animate) {
              switch (this.state) {
                case States.idle:
                  if (this.character.actionsLeft) {
                    this.state = States.planning;
                    this.chooseAction(timestamp, world);
                  }
                  break;

                case States.planning:
                  break;
        
                case States.scripting:
                  break;      
              }
            }
            else {
              this.chooseAction(timestamp, world);
              world.endTurn2(this);
            }
          // }
        }
      }
      else {
        if (world.participants.activeActor === this) {
          world.endTurn2(this);
        }
      }
    }

    return false;
  }

  addShot(targetActor: Actor, timestamp: number, world: WorldInterface) {
    const result = this.computeShotData(targetActor);

    const data: ShotData = {
      velocityVector: result.velocityVector,
      orientation: result.orientation,
      startPos: result.startPos,
      position: result.startPos,
    };

    const shot = new Shot(world.shot, this, data);
    world.actors.push(shot);

    if (this.renderPass) {
      shot.addToScene(this.renderPass);
    }

    // Transforms the position to world space.
    const emitterPosition = vec4.transformMat4(
      vec4.create(0, this.chestHeight, 0, 1),
      this.sceneNode.transform,
    );

    playShot(emitterPosition);

    // Remove any previously drawn trajectory.
    // if (this.trajectory) {
    //   this.mainRenderPass.removeDrawable(this.trajectory, 'trajectory');
    //   this.trajectory = null;
    // }
  }

  attack(
    targetActor: Actor,
    weapon: Weapon,
    world: WorldInterface,
    script: Script,
  ) {
    let advantage: Advantage = 'Neutral';
    if ([WeaponType.MartialRange, WeaponType.SimpleRange].includes(weapon.type)) {
      const wp = this.getWorldPosition();
      const targetWp = this.getWorldPosition();
      const distance = vec2.distanceSq(vec2.create(wp[0], wp[2]), vec2.create(targetWp[0], targetWp[2]));

      if (weapon.range !== null && distance > weapon.range[0]) {
        advantage = 'Disadvantage';
      }
    }

    let [damage, critical] = attackRoll(this.character, targetActor.character, weapon, false, advantage);

    if (
      targetActor.character.hasCondition('Rage')
      && [DamageType.Bludgeoning, DamageType.Piercing, DamageType.Slashing].includes(weapon.damage)
    ) {
      damage = Math.trunc(damage / 2);
    }

    targetActor.takeDamage(damage, critical, this, weapon.name, script);

    if (this.character.hasCondition('Sanctuary')) {
      this.character.removeCondition('Sanctuary')
      script.entries.push(new Logger(`${this.character.name} lost sanctuary.`))
    }
  }

  takeDamage(damage: number, critical: boolean, from: Actor, weaponName: string, script: Script) {
    if (this.character.hitPoints > 0) {
      this.character.hitPoints -= damage;

      if (damage > 0) {
        script.entries.push(new Logger(`${from.character.name} ${critical ? 'critically ' : ''}hit ${this.character.name} for ${damage} points with a ${weaponName}.`))

        this.character.removeCondition('Charmed')
      }
      else {
        script.entries.push(new Logger(`${from.character.name} missed ${this.character.name} with a ${weaponName}.`))
      }

      if (this.character.hitPoints <= 0) {
        this.character.hitPoints = 0;

        script.entries.push(new Logger(`${this.character.name} died.`))

        script.entries.push(new Remover(this));
      }
    }
  }

  takeHealing(hitPoints: number, from: Actor, by: string, script: Script) {
    this.character.hitPoints = Math.min(this.character.hitPoints + hitPoints, this.character.maxHitPoints);

    script.entries.push(new Logger(`${this.character.name} healed ${hitPoints} hit points by ${by} from ${from.character.name}.`))
  }

  computeShotData(targetActor: Actor) {
    // Transforms the position to world space.
    const target = vec4.transformMat4(
      vec4.create(0, 0, 0, 1),
      targetActor.sceneNode.transform,
    );
    target[1] = targetActor.chestHeight;

    const startPos = vec4.transformMat4(
      vec4.create(0, 0, 0, 1),
      this.sceneNode.transform,
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

    const angle = Math.atan2(target[0] - this.sceneNode.translate[0], target[2] - this.sceneNode.translate[2]);
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

