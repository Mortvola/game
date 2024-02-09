import { Vec2, Vec4, mat4, quat, vec2, vec3, vec4 } from "wgpu-matrix";
import { anglesOfLaunch, degToRad, feetToMeters, minimumVelocity, pointWithinCircle, timeToTarget } from "../Renderer/Math";
import Circle from "../Renderer/Drawables/Circle";
import Shot from "../Script/Shot";
import { Advantage, attackRoll, savingThrow } from "../Dice";
import Mover from "../Script/Mover";
import Script from "../Script/Script";
import Logger from "../Script/Logger";
import Remover from "../Script/Remover";
import Delay from "../Script/Delay";
import FollowPath from "../Script/FollowPath";
import JumpPointSearch from "../Search/JumpPointSearch";
import UniformGridSearch from "../Search/UniformGridSearch";
import { findPath2, getOccupants, populateGrid } from "../Workers/PathPlannerQueue";
import MeleeAttack from "./Actions/MeleeAttack";
import RangeAttack from "./Actions/RangeAttack";
import { sceneObjectlManager } from "../SceneObjectManager";
import { PathPoint } from "../Workers/PathPlannerTypes";
import DrawableNode from "../Renderer/Drawables/SceneNodes/DrawableNode";
import { ActionInterface, CharacterInterface, CreatureActorInterface, SceneObjectInterface, ShotData, States, WorldInterface } from "../types";
import { DamageType, Weapon, WeaponType } from "./Equipment/Types";
import MoveAction from "./Actions/MoveAction";
import RenderPass from "../Renderer/RenderPasses/RenderPass";

// let findPathPromise: {
//   resolve: ((value: [Vec2[], number, number[][]]) => void),
// } | null = null

export const pathFinder: UniformGridSearch = new JumpPointSearch(512, 512, 16);

let actorId = 0;
export const getActorId = () => {
  const r = actorId;
  actorId += 1;

  return r;
}

class Actor implements CreatureActorInterface {
  id: number;

  character: CharacterInterface;

  team: number;

  automated: boolean;

  metersPerSecond = 2;

  distanceLeft = 0;

  turnDuration = 6;

  height = 1.75;

  chestHeight = 1.45;

  occupiedRadius = 0.75; // 0.707106781186548; // feetToMeters(2.5);

  attackRadius = this.occupiedRadius + feetToMeters(5);

  sceneObject: SceneObjectInterface

  circleDrawable: Circle;

  circle: DrawableNode;

  outerCircle: DrawableNode;

  teamColor: Vec4;

  initiativeRoll = 0;

  renderPass: RenderPass | null = null;

  state = States.idle;

  world: WorldInterface;

  private action: ActionInterface | null = null;

  private useQLearning = false;

  private constructor(
    character: CharacterInterface,
    sceneObject: SceneObjectInterface,
    height: number,
    color: Vec4,
    team: number,
    automated: boolean,
    circleDrawable: Circle,
    circle: DrawableNode,
    outerCircle: DrawableNode,
    world: WorldInterface,
  ) {
    this.world = world;

    this.id = getActorId();

    this.character = character;
    this.character.actor = this;

    this.team = team;
    this.automated = automated;
    this.sceneObject = sceneObject
    this.height = height;
    this.chestHeight = height - 0.5;
    this.teamColor = color;

    // this.sceneObject.sceneNode.name = character.name;

    const q = quat.fromEuler(degToRad(270), 0, 0, "xyz");

    this.circleDrawable = circleDrawable;
    this.circle = circle;
    this.circle.postTransforms.push(mat4.fromQuat(q));

    this.outerCircle = outerCircle;
    this.outerCircle.postTransforms.push(mat4.fromQuat(q));

    this.sceneObject.sceneNode.addNode(this.circle)
    this.sceneObject.sceneNode.addNode(this.outerCircle)
  }

  static async create(
    character: CharacterInterface, color: Vec4, teamColor: Vec4, team: number, automated: boolean, world: WorldInterface,
  ) {
    const playerHeight = character.race.height;

    const sceneObject = await sceneObjectlManager.getSceneObject(character.race.name, world)

    const circleDrawable = new Circle(0.75, 0.025, color);
    const circle = await DrawableNode.create(circleDrawable);

    const outerCircle = await DrawableNode.create(new Circle(0.75 + feetToMeters(5), 0.01, color));

    return new Actor(character, sceneObject, playerHeight, teamColor, team, automated, circleDrawable, circle, outerCircle, world);
  }

  getWorldPosition(): Vec4 {
    // Transforms the position to world space.
    return vec4.transformMat4(
      vec4.create(0, 0, 0, 1),
      this.sceneObject.sceneNode.transform,
    );    
  }

  startTurn() {
    this.character.actionsLeft = 1;
    this.character.bonusActionsLeft = 1;

    this.distanceLeft = this.character.race.speed;

    // this.circleDrawable.color[0] = 1;
    // this.circleDrawable.color[1] = 1;
    // this.circleDrawable.color[2] = 1;
    // this.circleDrawable.color[3] = 1;

    this.state = States.idle;

    this.decrementDurations(false);

    if (!this.automated) {
      this.setDefaultAction();

      const participants = this.world.participants.turns.filter((a) => a.character.hitPoints > 0);
      const occupants = getOccupants(this, participants, this.world.occupants);

      populateGrid(this, occupants);
    }

    if (this.character.hasCondition('Prone')) {
      this.distanceLeft -= this.character.race.speed / 2;
      this.character.removeCondition('Prone')
      console.log(`${this.character.name} stood up: ${this.distanceLeft}.`)
    }
  }

  setDefaultAction() {
    if (this.character.primaryWeapon === 'Melee') {
      this.setAction(new MeleeAttack(this));
    }
    else {
      this.setAction(new RangeAttack(this));
    }
  }

  setMoveAction(): void {
    this.setAction(new MoveAction(this));
  }

  endTurn() {
    // If the actor is not currently prone then
    // check if the actor is standing on grease. If so,
    // do the dexterity saving throw to see if they fall prone.
    if (!this.character.hasCondition('Prone')) {
      const wp = this.getWorldPosition();
      const wpV2 = vec2.create(wp[0], wp[2]);
  
      for (const occupant of this.world.occupants) {
        if (occupant.name === 'Grease' && pointWithinCircle(occupant.center, occupant.radius, wpV2)) {
          const st = savingThrow(this.character, this.character.abilityScores.dexterity, 'Neutral');

          if (st < occupant.dc!) {
            console.log(`${this.character.name} fell prone.`)
            this.character.addCondition('Prone')
          }
          else {
            console.log('succeeded at saving throw.')
          }

          break;
        }
      }
    }

    // this.circleDrawable.color[0] = this.teamColor[0];
    // this.circleDrawable.color[1] = this.teamColor[1];
    // this.circleDrawable.color[2] = this.teamColor[2];
    // this.circleDrawable.color[3] = this.teamColor[3];

    this.setAction(null);
    
    this.state = States.idle;

    this.decrementDurations(true);
  }

  decrementDurations(endofTurn: boolean) {
    for (let i = 0; i < this.character.enduringActions.length; i += 1) {
      if (
        (endofTurn && this.character.enduringActions[i].endOfTurn)
        || (!endofTurn && !this.character.enduringActions[i].endOfTurn)
      ) {
        const action = this.character.enduringActions[i];
        action.duration -= 6;

        if (action.duration <= 0) {
          if (this.character.concentration === action) {
            this.character.stopConcentrating();
          }
          else {
            for (const target of action.targets) {
              target.character.removeInfluencingAction(action.name)
            }
          }
        
          this.character.enduringActions = [
            ...this.character.enduringActions.slice(0, i),
            ...this.character.enduringActions.slice(i + 1),
          ]  
        }
      }
    }
  }

  nextState(state: number) {

  }

  getTargets(otherTeam: CreatureActorInterface[]) {
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
    const mover = new Mover(this.sceneObject, vec2.create(newPos[0], newPos[2]), this.world);
    script.entries.push(mover);
  }

  async rangeAttack(target: CreatureActorInterface, script: Script) {
    const shotData = this.computeShotData(target);
  
    const data: ShotData = {
      velocityVector: shotData.velocityVector,
      orientation: shotData.orientation,
      startPos: shotData.startPos,
      position: shotData.startPos,
      distance: shotData.distance,
    };

    const sceneObject = await sceneObjectlManager.getSceneObject('Shot', this.world);

    const shot = new Shot(sceneObject, this, data, this.world);
    script.entries.push(shot);

    this.attack(
      target,
      this.character.equipped.rangeWeapon!,
      script,
    );

    if (this.character.actionsLeft > 0) {
      this.character.actionsLeft -= 1;
    }
  }

  async chooseAction(timestamp: number) {
    const otherTeam = this.world.participants.participants[this.team ^ 1].filter((a) => a.character.hitPoints > 0);
    
    if (otherTeam.length > 0) {
      const script = new Script(this.world);

      if (this.useQLearning) {
        // let action: Action | null = null;

        // if (this.team === 1 && qStore.store.size > 0) {
        //   const state: Key = {
        //     opponent: otherTeam.map((t) => ({
        //       hitPoints: t.character.hitPoints,
        //       weapon: ((t.character.equipped.meleeWeapon!.die[0].die + 1) / 2) * t.character.equipped.meleeWeapon!.die[0].numDice,
        //       armorClass: t.character.armorClass,
        //     })),
        //   };

        //   action = qStore.getBestAction(state);

        //   if (action === null) {
        //     workerQueue.update(state, world.participants.parties)
        //   }
        // }

        // this.takeAction(action, otherTeam, timestamp, world, script);
        // this.state = States.scripting;
      }
      else {
        script.entries.push(new Delay(2000, this.world));

        const charmed = this.character.getInfluencingAction('Charm Person');

        let participants = this.world.participants.turns.filter((a) => a.character.hitPoints > 0);
        const otherTeam = this.world.participants.participants[this.team ^ 1]
          .filter((a) => (
            a.character.hitPoints > 0
            && !a.character.hasInfluencingAction('Sanctuary')
            && (!charmed || charmed.actor !== a)
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

          if (this.character.hasCondition('Prone') && this.distanceLeft >= this.character.race.speed / 2) {
            script.entries.push(new Logger(`${this.character.name} stood up`, this.world));
            this.character.removeCondition('Prone');
            this.distanceLeft -= this.character.race.speed / 2;
          }

          if (this.character.actionsLeft > 0) {
            if (closest.distance <= this.attackRadius) {
              // The target is already in range.
              this.attack(
                target,
                this.character.equipped.meleeWeapon!,
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

              const occupants = getOccupants(this, participants, this.world.occupants);

              populateGrid(this, occupants);

              let [path] = await findPath2(
                start,
                goal,
                target.occupiedRadius + (this.attackRadius - this.occupiedRadius) * 0.75,
                target,
                this.distanceLeft,
              );
              
              if (this !== this.world.participants.activeActor) {
                return;
              }

              if (path.length > 0) {
                let distanceToTarget = vec2.distance(path[0].point, goal);
                distanceToTarget -= target.occupiedRadius

                if (distanceToTarget < this.attackRadius) {
                  path = this.processPath(path, script);

                  script.entries.push(new FollowPath(this.sceneObject, path, this.world));  

                  myPosition = vec4.create(path[0].point[0], 0, path[0].point[1], 1);

                  this.attack(
                    target,
                    this.character.equipped.meleeWeapon!,
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
                    await this.rangeAttack(target, script);
      
                    if (target.character.hitPoints === 0) {
                      targets = targets.filter((t) => t !== closest);
                      participants = participants.filter((t) => t !== target)
                      continue;
                    }
                  }
  
                  path = this.processPath(path, script);
                  script.entries.push(new FollowPath(this.sceneObject, path, this.world));

                  done = true;
                }
              }
              else {
                if (this.character.equipped.rangeWeapon) {
                  await this.rangeAttack(target, script);

                  if (target.character.hitPoints === 0) {
                    targets = targets.filter((t) => t !== closest);
                    participants = participants.filter((t) => t !== target)
                  }
                }
                else {
                  // Can't find path to target. Try another
                  targets = targets.slice(1)
                }
              }
            }
          }
          else {
            // No action to excute but we can move closer to the target if needed.
            if (this.distanceLeft > 0 && closest.distance > this.attackRadius) {
              // Find path to the closest
              const start = vec2.create(myPosition[0], myPosition[2]);
              const t = target.getWorldPosition();
              const goal = vec2.create(t[0], t[2])

              const occupants = getOccupants(this, participants, this.world.occupants);

              populateGrid(this, occupants);

              let [path] = await findPath2(
                start,
                goal,
                target.occupiedRadius + (this.attackRadius - this.occupiedRadius)  * 0.75,
                target,
                this.distanceLeft,
              );

              if (this !== this.world.participants.activeActor) {
                return;
              }

              if (path.length > 0) {
                path = this.processPath(path, script);
                script.entries.push(new FollowPath(this.sceneObject, path, this.world));    

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
          script.entries.push(new Delay(2000, this.world));

          script.onFinish = (timestamp: number) => {
            this.world.endTurn2(this);  
          }
        }

        this.world.actors.push(script);
      }
    }
    else {
      this.world.endTurn2(this);
    }
  }

  async update(elapsedTime: number, timestamp: number): Promise<boolean> {
    if (this.automated) {
      if (this.character.hitPoints > 0) {
        if (this.world.participants.activeActor === this) {
          // if (this.actionsLeft) {
            if (this.world.animate) {
              switch (this.state) {
                case States.idle:
                  if (this.character.actionsLeft) {
                    this.state = States.planning;
                    this.chooseAction(timestamp);
                  }
                  break;

                case States.planning:
                  break;
        
                case States.scripting:
                  break;      
              }
            }
            else {
              this.chooseAction(timestamp);
              this.world.endTurn2(this);
            }
          // }
        }
      }
      else {
        if (this.world.participants.activeActor === this) {
          this.world.endTurn2(this);
        }
      }
    }

    return false;
  }

  attack(
    targetActor: CreatureActorInterface,
    weapon: Weapon,
    script: Script,
  ): void {
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
      (targetActor.character.hasInfluencingAction('Rage') || targetActor.character.hasInfluencingAction('Blade Ward'))
      && [DamageType.Bludgeoning, DamageType.Piercing, DamageType.Slashing].includes(weapon.damage)
    ) {
      damage = Math.trunc(damage / 2);
    }

    targetActor.takeDamage(damage, critical, this, weapon.name, script);

    if (this.character.hasInfluencingAction('Sanctuary')) {
      this.character.removeInfluencingAction('Sanctuary')
      script.entries.push(new Logger(`${this.character.name} lost sanctuary.`, this.world))
    }
  }

  takeDamage(damage: number, critical: boolean, from: Actor, weaponName: string, script: Script): void {
    if (this.character.hitPoints > 0) {
      if (this.character.temporaryHitPoints > 0) {
        if (damage <= this.character.temporaryHitPoints) {
          this.character.temporaryHitPoints -= damage;
        }
        else {
          this.character.hitPoints -= (damage - this.character.temporaryHitPoints);
          this.character.temporaryHitPoints = 0;
        }
      }
      else {
        this.character.hitPoints -= damage;
      }

      if (damage > 0) {
        script.entries.push(new Logger(`${from.character.name} ${critical ? 'critically ' : ''}hit ${this.character.name} for ${damage} points with a ${weaponName}.`, this.world))

        this.character.removeInfluencingAction('Charm Person')

        if (this.character.concentration) {
          const st = savingThrow(this.character, this.character.abilityScores.constitution, 'Neutral');

          if (st < Math.min(10, damage / 2)) {
            script.entries.push(new Logger(`${this.character.name} stopped concentrating on ${this.character.concentration.name}.`, this.world))

            for (const target of this.character.concentration.targets) {
              script.entries.push(new Logger(`${target.character.name} lost ${this.character.concentration.name}.`, this.world))
            }
  
            this.character.stopConcentrating();
          }
        }
      }
      else {
        script.entries.push(new Logger(`${from.character.name} missed ${this.character.name} with a ${weaponName}.`, this.world))
      }

      if (this.character.hitPoints <= 0) {
        this.character.hitPoints = 0;

        script.entries.push(new Logger(`${this.character.name} died.`, this.world))

        if (this.character.concentration) {
          for (const target of this.character.concentration.targets) {
            script.entries.push(new Logger(`${target.character.name} lost ${this.character.concentration.name}.`, this.world))
          }
          
          this.character.stopConcentrating();
        }

        script.entries.push(new Remover(this, this.world));
      }
    }
  }

  takeHealing(hitPoints: number, from: Actor, by: string, script: Script): void {
    if (!this.character.hasInfluencingAction('Chill Touch')) {
      this.character.hitPoints = Math.min(this.character.hitPoints + hitPoints, this.character.maxHitPoints);

      script.entries.push(new Logger(`${this.character.name} healed ${hitPoints} hit points by ${by} from ${from.character.name}.`, this.world))  
    }
    else {
      script.entries.push(new Logger(`${this.character.name} could not be healed because of Bone Chill.`, this.world))  
    }
  }

  computeShotData(targetActor: CreatureActorInterface): ShotData {
    // Transforms the position to world space.
    const target = vec4.transformMat4(
      vec4.create(0, 0, 0, 1),
      targetActor.sceneObject.sceneNode.transform,
    );
    target[1] = targetActor.chestHeight;

    const startPos = vec4.transformMat4(
      vec4.create(0, 0, 0, 1),
      this.sceneObject.sceneNode.transform,
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

    const angle = Math.atan2(target[0] - this.sceneObject.sceneNode.translate[0], target[2] - this.sceneObject.sceneNode.translate[2]);
    const rotate = mat4.rotationY(angle);

    const orientation = vec3.normalize(vec4.transformMat4(vec4.create(0, 0, 1, 0), rotate));
    orientation[3] = 0;

    return ({
      velocityVector: vec2.create(velocity * Math.cos(lowAngle), velocity * Math.sin(lowAngle)),
      duration: timeLow,
      startPos,
      orientation,
      distance,
      position: vec4.create(),
    });
  }


  setAction(action: ActionInterface | null): void {
    if (this.action) {
      this.action.clear();
    }

    this.action = action;

    if (this.action && this) {
      this.action.initialize();
    }
  }

  getAction(): ActionInterface | null {
    return this.action;
  }

  processPath(path: PathPoint[], script: Script): PathPoint[] {
        // Process the path looking for situations (such as grease) that
    // may affect the final destination.
    const getNewPoint = (p1: Vec2, p2: Vec2, distanceLeft: number)  => {
      let v = vec2.normalize(vec2.subtract(p2, p1));
  
      // Scale by the distance left to move
      v = vec2.mulScalar(v, distanceLeft);

      // Add it to the current position to get the new position.
      return vec2.add(p1, v);
    }

    for (let i = path.length - 1; i > 0; i -= 1) {
      const distance = vec2.distance(path[i].point, path[i - 1].point)

      if (path[i].difficult) {
        if (distance * 2 > this.distanceLeft) {
          const newPoint = getNewPoint(path[i].point, path[i - 1].point, this.distanceLeft / 2)

          this.distanceLeft = 0;

          return [
            { point: newPoint, difficult: path[i].difficult, type: path[i].type },
            ...path.slice(i),
          ]
        }

        this.distanceLeft -= distance * 2;
      }
      else {
        if (distance > this.distanceLeft) {
          const newPoint = getNewPoint(path[i].point, path[i - 1].point, this.distanceLeft)

          this.distanceLeft = 0;

          return [
            { point: newPoint, difficult: path[i].difficult, type: path[i].type },
            ...path.slice(i),
          ]
        }

        this.distanceLeft -= distance;
      }

      // Are we transitioning from non-grease to grease?
      // If so, roll a dexterity saving throw
      if (
        path[i - 1].type !== path[i].type
        && path[i - 1].type === 'Grease'
      ) {
        const st = savingThrow(this.character, this.character.abilityScores.dexterity, 'Neutral');

        if (st < this.character.spellCastingDc) {
          script.entries.push(new Logger(`${this.character.name} fell prone.`, this.world))
          this.character.addCondition('Prone')

          if (this.distanceLeft >= this.character.race.speed / 2) {
            this.distanceLeft -= this.character.race.speed / 2;
            this.character.removeCondition('Prone')
            script.entries.push(new Logger(`${this.character.name} stood up.`, this.world))
          }
          else {
            this.distanceLeft = 0;
            break;
          }
        }
        else {
          script.entries.push(new Logger(`${this.character.name} succeeded a dexterity saving throw.`, this.world))
        }
      }
    }

    return path;
  }
}

export default Actor;

