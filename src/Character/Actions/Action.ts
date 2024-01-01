import { Vec2, Vec4, vec2 } from "wgpu-matrix";
import Script from "../../Script/Script";
import { WorldInterface } from "../../WorldInterface";
import Actor from "../Actor";
import { findPath2, getOccupants } from "../../Workers/PathPlannerQueue";
import Line from "../../Drawables/Line";
import FollowPath from "../../Script/FollowPath";

class Action {
  name: string;

  time: 'Action' | 'Bonus' | 'Move';

  path: Vec2[] = [];

  distance = 0;

  target: Actor | null = null;

  constructor(name: string, time: 'Action' | 'Bonus' | 'Move') {
    this.name = name;
    this.time = time;
  }
  
  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {

  }

  interact(actor: Actor, script: Script, world: WorldInterface): void {

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
              if (world.pathLines) {
                world.mainRenderPass.removeDrawable(world.pathLines, 'line');
              }

              world.pathLines = new Line(lines);
              world.mainRenderPass.addDrawable(world.pathLines, 'line');

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
        if (world.trajectory) {
          world.mainRenderPass.removeDrawable(world.trajectory, 'trajectory');
          world.trajectory = null;
        }

        if (world.pathLines) {
          world.mainRenderPass.removeDrawable(world.pathLines, 'line');
        }

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

      if (world.trajectory) {
        world.mainRenderPass.removeDrawable(world.trajectory, 'trajectory');
        world.trajectory = null;
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
            if (world.pathLines) {
              world.mainRenderPass.removeDrawable(world.pathLines, 'line');
            }
  
            if (path.length > 0) {
              world.pathLines = new Line(lines);
    
              world.mainRenderPass.addDrawable(world.pathLines, 'line');
            }
            else {
              console.log('path length === 0')
            }
  
            // this.type = 'Move';
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

  zeroDistanceAction(actor: Actor, script: Script, world: WorldInterface, action: () => void): void {
    if (this.path.length > 0) {
      script.entries.push(new FollowPath(actor.sceneNode, this.path));    
      actor.distanceLeft -= this.distance;
    }

    if (this.target) {
      action();
    }

    if (world.pathLines) {
      world.mainRenderPass.removeDrawable(world.pathLines, 'line');
    }

    this.path = [];
    this.target = null;
    this.distance = 0;  
  }
}

export default Action;
