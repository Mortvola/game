import { Vec2, Vec4, mat4, quat, vec2, vec3, vec4 } from "wgpu-matrix";
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
import { Action, Key } from "../Worker/QStore";
import Character from "./Character";
import { attackRoll } from "../Dice";
import { qStore, workerQueue } from "../WorkerQueue";
import Mover from "../Script/Mover";
import Script from "../Script/Script";
import Weapon from "./Equipment/Weapon";
import ContainerNode from "../Drawables/ContainerNode";
import Logger from "../Script/Logger";
import Remover from "../Script/Remover";
import Delay from "../Script/Delay";
import FollowPath from "../Script/FollowPath";
import Line from "../Drawables/Line";
import JumpPointSearch from "../Search/JumpPointSearch";
import UniformGridSearch from "../Search/UniformGridSearch";

export const pathFinder: UniformGridSearch = new JumpPointSearch(512, 512, 16);

const pointActors = false;

export type EpisodeInfo = {
  winningTeam: number,
}

export enum States {
  idle,
  scripting,
}

class Actor implements ActorInterface {
  character: Character;

  team: number;

  automated: boolean;

  metersPerSecond = 2;

  actionsLeft = 0;

  distanceLeft = 0;

  turnDuration = 6;

  height = 1.75;

  chestHeight = 1.45;

  occupiedRadius = feetToMeters(2.5);

  attackRadius = this.occupiedRadius + feetToMeters(0.5);

  sceneNode = new ContainerNode();

  circle: Circle;

  outerCircle: Circle;

  teamColor: Vec4;

  initiativeRoll = 0;

  renderPass: RenderPass | null = null;

  state = States.idle;

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
    character: Character, color: Vec4, teamColor: Vec4, team: number, automated: boolean,
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
    this.actionsLeft = 1;

    this.distanceLeft = this.character.race.speed;

    this.circle.color[0] = 1;
    this.circle.color[1] = 1;
    this.circle.color[2] = 1;
    this.circle.color[3] = 1;

    this.state = States.idle;
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
  }

  useQLearning = false;

  getTargets(otherTeam: Actor[]) {
    const myPosition = this.getWorldPosition();

    const rankedTargets = otherTeam.map((a, index) => ({
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

  findPath(start: Vec2, goal: Vec2, target: Actor | null, world: WorldInterface): [Vec2[], number] {
    let path: Vec2[] = [];

    path = pathFinder.findPath(start, goal, target);

    // Trim the path to the extent the character can move in a single turn.
    let totalDistance = 0;
    for (let i = path.length - 1; i > 0; i -= 1) {
      const distance = vec2.distance(path[i], path[i - 1]);

      if (totalDistance + distance < this.distanceLeft) {
        totalDistance += distance;
      }
      else {
        const remainingDistance = this.distanceLeft - totalDistance;

        const v = vec2.normalize(vec2.subtract(path[i - 1], path[i]));

        const newPoint = vec2.add(path[i], vec2.mulScalar(v, remainingDistance));

        path = [
          newPoint,
          ...path.slice(i),
        ]

        totalDistance += remainingDistance;

        break;
      }
    }

    if (pathFinder.lines.length > 0) {
      if (world.path2) {
        world.mainRenderPass.removeDrawable(world.path2, 'line');
      }

      world.path2 = new Line(
        pathFinder.lines,
        vec4.create(1, 1, 0, 1),
      );

      world.mainRenderPass.addDrawable(world.path2, 'line');              
    }

    return [path, totalDistance];
  }

  chooseAction(timestamp: number, world: WorldInterface): Actor[] {
    let removedActors: Actor[] = [];
  
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

        let participants = world.participants.turns.filter((a) => a.character.hitPoints > 0);
        const otherTeam = world.participants.participants[this.team ^ 1].filter((a) => a.character.hitPoints > 0);
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

          // Mark grid with which grid cells are occupied with
          // the other actors excluding self and the target.
          pathFinder.clear();
          for (const a of participants) {
            if (a !== this && a !== target) {
              const point = a.getWorldPosition();
  
              const center = vec2.create(point[0], point[2]);
  
              pathFinder.fillCircle(a, center, a.occupiedRadius + this.occupiedRadius);
            }
          }

          if (this.actionsLeft > 0) {
            if (closest.distance <= this.attackRadius + target.occupiedRadius) {
              // The target is already in range.
              this.attack(
                target,
                this.character.equipped.meleeWeapon!,
                world,
                script,
              );

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

              const [path, dist] = this.findPath(start, goal, target, world);
              
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

              const [path, dist] = this.findPath(start, goal, target, world);

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
            world.endTurn2();  
          }
        }

        world.actors.push(script);
      }
    }
    else {
      world.endTurn2();
    }

    return removedActors;
  }

  update(elapsedTime: number, timestamp: number, world: WorldInterface): ActorInterface[] {
    let removedActors: ActorInterface[] = [];

    if (this.automated) {
      if (this.character.hitPoints > 0) {
        if (world.participants.activeActor === this) {
          // if (this.actionsLeft) {
            if (world.animate) {
              switch (this.state) {
                case States.idle:
                  if (this.actionsLeft) {
                    removedActors = this.chooseAction(timestamp, world);
                  }
                  break;
        
                case States.scripting:
                  break;      
              }
            }
            else {
              removedActors = this.chooseAction(timestamp, world);
              world.endTurn2();
            }
          // }
        }
      }
      else {
        if (world.participants.activeActor === this) {
          world.endTurn2();
        }
      }
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
    this.actionsLeft -= 1;

    const damage = attackRoll(this.character, targetActor.character, weapon, false);

    targetActor.character.hitPoints -= damage;

    if (damage > 0) {
      script.entries.push(new Logger(`${this.character.name} hit ${targetActor.character.name} for ${damage} points with a ${weapon.name}.`))
    }
    else {
      script.entries.push(new Logger(`${this.character.name} missed ${targetActor.character.name} with a ${weapon.name}.`))
    }

    if (targetActor.character.hitPoints <= 0) {
      targetActor.character.hitPoints = 0;

      script.entries.push(new Logger(`${targetActor.character.name} the ${targetActor.character.charClass.name} died.`))

      script.entries.push(new Remover(targetActor));

      if (!world.animate) {
        world.participants.remove(targetActor);
        world.collidees.remove(targetActor);
        targetActor.removeFromScene();
        world.scene.removeNode(targetActor.sceneNode);
      }
    }
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

