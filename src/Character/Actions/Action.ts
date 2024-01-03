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
  name: string;

  time: TimeType;

  path: Vec2[] = [];

  distance = 0;

  target: Actor | null = null;

  pathLines: Line | null = null;

  trajectory: Trajectory | null = null;

  cleared = false;

  constructor(name: string, time: TimeType) {
    this.name = name;
    this.time = time;
  }
  
  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {

  }

  interact(actor: Actor, script: Script, world: WorldInterface): boolean {
    return true;
  }

  initialize(actor: Actor) {
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

  prepareZeroDistAction(actionPercent: number, actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    if (target) {
      const wp = actor.getWorldPosition();
      const targetWp = target.getWorldPosition();

      const distance = vec2.distance(
        vec2.create(wp[0], wp[2]),
        vec2.create(targetWp[0], targetWp[2]),
      )

      if (distance > actor.attackRadius + target.occupiedRadius) {
        // To far for a melee attack
        // Find a path to the target...

        let participants = world.participants.turns.filter((a) => a.character.hitPoints > 0);
        const occupants = getOccupants(actor, target, participants, []);

        (async () => {
          const [path, distance, lines, cancelled] = await findPath2(
            actor,
            vec2.create(wp[0], wp[2]),
            vec2.create(targetWp[0], targetWp[2]),
            target.occupiedRadius + actor.occupiedRadius,
            target, occupants,
          )

          if (!cancelled) {
            if (path.length > 0) {
              this.showPathLines(lines);

              let distanceToTarget = vec2.distance(path[0], vec2.create(targetWp[0], targetWp[2]));
              distanceToTarget -= target.occupiedRadius  

              this.path = path;
              this.distance = distance;

              if (distanceToTarget < actor.attackRadius) {
                // this.type = 'MoveAndMelee';
                this.target = target;

                if (world.actionInfoCallback) {
                  world.actionInfoCallback({
                    action: this.name,
                    percentSuccess: actionPercent,
                  })
                }          
              }
              else {
                // this.type = 'Move';
                this.target = null;

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

        this.target = target;
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
      this.target = null;

      if (this.trajectory) {
        world.mainRenderPass.removeDrawable(this.trajectory, 'trajectory');
        this.trajectory = null;
      }

      if (point) {
        const wp = actor.getWorldPosition();
        
        let targetWp = vec2.create(point[0], point[2])

        let participants = world.participants.turns.filter((a) => a.character.hitPoints > 0);
        const occupants = getOccupants(actor, target, participants, []);

        (async () => {  
          const [path, distance, lines, cancelled] = await findPath2(
            actor,
            vec2.create(wp[0], wp[2]),
            targetWp,
            null,
            target, occupants,
          )
  
          if (!cancelled && !this.target) {
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

  zeroDistanceAction(actor: Actor, script: Script, world: WorldInterface, action: () => void): boolean {
    if (this.path.length > 0) {
      script.entries.push(new FollowPath(actor.sceneNode, this.path));    
      actor.distanceLeft -= this.distance;
    }

    this.showPathLines(null);

    if (this.target) {
      action();

      return true;
    }

    this.path = [];
    this.target = null;
    this.distance = 0;

    return false;
  }
}

export default Action;
