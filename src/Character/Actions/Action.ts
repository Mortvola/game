import { Vec2, Vec4, vec2 } from "wgpu-matrix";
import Script from "../../Script/Script";
import { WorldInterface } from "../../WorldInterface";
import Actor from "../Actor";
import { findPath2, getOccupants } from "../../Workers/PathPlannerQueue";
import Line from "../../Drawables/Line";
import FollowPath from "../../Script/FollowPath";
import { getWorld } from "../../Renderer";
import Trajectory from "../../Drawables/Trajectory";

export type TimeType = 'Action' | 'Bonus' | 'Move';

class Action {
  actor: Actor;

  name: string;

  time: TimeType;

  duration: number;

  endOfTurn: boolean;

  path: Vec2[] = [];

  distance = 0;

  focused: Actor | null = null;

  targets: Actor[] = [];

  maxTargets: number;

  pathLines: Line | null = null;

  trajectory: Trajectory | null = null;

  cleared = false;

  constructor(actor: Actor, maxTargets: number, name: string, time: TimeType, duration: number, endOfTurn: boolean) {
    this.actor = actor;
    this.maxTargets = maxTargets;

    this.name = name;
    this.time = time;

    this.duration = duration;
    this.endOfTurn = endOfTurn;
  }
  
  prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): void {

  }

  interact(script: Script, world: WorldInterface): boolean {
    return true;
  }

  initialize() {
  }

  clear() {
    this.cleared = true;

    const world = getWorld();

    this.showPathLines(null);

    if (this.trajectory) {
      world.mainRenderPass.removeDrawable(this.trajectory, 'trajectory');
      this.trajectory = null;
    }
  }

  showPathLines(lines: number[][] | null) {
    const world = getWorld();

    if (this.pathLines) {
      world.mainRenderPass.removeDrawable(this.pathLines, 'line');
    }

    if (lines !== null && !this.cleared && lines.length > 0) {
      this.pathLines = new Line(lines);
      world.mainRenderPass.addDrawable(this.pathLines, 'line');  
    }
  }

  prepareZeroDistAction(actionPercent: number, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    if (target) {
      const wp = this.actor.getWorldPosition();
      const targetWp = target.getWorldPosition();

      const distance = vec2.distance(
        vec2.create(wp[0], wp[2]),
        vec2.create(targetWp[0], targetWp[2]),
      )

      if (distance > this.actor.attackRadius + target.occupiedRadius) {
        // To far for a melee attack
        // Find a path to the target...

        let participants = world.participants.turns.filter((a) => a.character.hitPoints > 0);
        const occupants = getOccupants(this.actor, target, participants, []);

        (async () => {
          const [path, distance, lines, cancelled] = await findPath2(
            this.actor,
            vec2.create(wp[0], wp[2]),
            vec2.create(targetWp[0], targetWp[2]),
            target.occupiedRadius + (target.attackRadius - target.occupiedRadius) * 0.75,
            target, occupants,
          )

          if (!cancelled) {
            if (path.length > 0) {
              this.showPathLines(lines);

              let distanceToTarget = vec2.distance(path[0], vec2.create(targetWp[0], targetWp[2]));
              distanceToTarget -= target.occupiedRadius  

              this.path = path;
              this.distance = distance;

              if (distanceToTarget < this.actor.attackRadius) {
                // this.type = 'MoveAndMelee';
                this.focused = target;

                if (world.actionInfoCallback) {
                  world.actionInfoCallback({
                    action: this.name,
                    percentSuccess: actionPercent,
                  })
                }          
              }
              else {
                // this.type = 'Move';
                this.focused = null;

                if (world.actionInfoCallback) {
                  world.actionInfoCallback({
                    action: this.name,
                    percentSuccess: actionPercent,
                  })
                }                  
              }
            }
          }
        })();
      }
      else {
        if (this.trajectory) {
          world.mainRenderPass.removeDrawable(this.trajectory, 'trajectory');
          this.trajectory = null;
        }

        this.showPathLines(null);

        this.focused = target;
        this.distance = 0;
        this.path = [];

        if (world.actionInfoCallback) {
          world.actionInfoCallback({
            action: this.name,
            percentSuccess: actionPercent,
          })
        }          
      }
    }
    else {
      this.focused = null;

      if (this.trajectory) {
        world.mainRenderPass.removeDrawable(this.trajectory, 'trajectory');
        this.trajectory = null;
      }

      if (point) {
        const wp = this.actor.getWorldPosition();
        
        let targetWp = vec2.create(point[0], point[2])

        let participants = world.participants.turns.filter((a) => a.character.hitPoints > 0);
        const occupants = getOccupants(this.actor, target, participants, []);

        (async () => {  
          const [path, distance, lines, cancelled] = await findPath2(
            this.actor,
            vec2.create(wp[0], wp[2]),
            targetWp,
            null,
            target, occupants,
          )
  
          if (!cancelled && !this.focused) {
            this.showPathLines(lines);
  
            this.path = path;
            this.distance = distance;

            if (world.actionInfoCallback) {
              world.actionInfoCallback({
                action: 'Move',
                percentSuccess: null,
              })
            }              
          }
        })();
      }  
    }
  }

  zeroDistanceAction(script: Script, world: WorldInterface, action: () => void): boolean {
    if (this.path.length > 0) {
      script.entries.push(new FollowPath(this.actor.sceneNode, this.path));    
      this.actor.distanceLeft -= this.distance;
    }

    this.showPathLines(null);

    if (this.targets.length > 0) {
      action();

      return true;
    }

    return false;
  }
}

export default Action;
