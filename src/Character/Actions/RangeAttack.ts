import { Vec4, vec2 } from "wgpu-matrix";
import Script from "../../Script/Script";
import { WorldInterface } from "../../WorldInterface";
import Action from "./Action";
import Actor from "../Actor";
import Trajectory from "../../Drawables/Trajectory";
import { findPath2, getOccupants } from "../../Workers/PathPlannerQueue";
import Line from "../../Drawables/Line";
import Shot, { ShotData } from "../../Script/Shot";
import FollowPath from "../../Script/FollowPath";

class RangeAttack extends Action {
  constructor() {
    super('Range', 'Action')
  }
  
  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    if (target) {
      const result = actor.computeShotData(target);
      
      if (world.trajectory) {
        world.mainRenderPass.removeDrawable(world.trajectory, 'trajectory');
        world.trajectory = null;
      }
    
      world.trajectory = new Trajectory({
        velocityVector: result.velocityVector,
        duration: result.duration,
        startPos: result.startPos,
        orientation: result.orientation,
        distance: result.distance,
      });
  
      world.mainRenderPass.addDrawable(world.trajectory, 'trajectory');
  
      if (world.pathLines) {
        world.mainRenderPass.removeDrawable(world.pathLines, 'line');
      }
  
      if (world.actionInfoCallback) {
        world.actionInfoCallback({
          action: this.name,
          percentSuccess: actor.character.percentSuccess(target.character, actor.character.equipped.rangeWeapon!),
        })
      }

      this.target = target;
      this.path = [];
      this.distance = 0;
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

  interact(actor: Actor, script: Script, world: WorldInterface): boolean {
    if (this.path.length > 0) {
      script.entries.push(new FollowPath(actor.sceneNode, this.path));    
      actor.distanceLeft -= this.distance;

      if (world.pathLines) {
        world.mainRenderPass.removeDrawable(world.pathLines, 'line');
      }
    }
    else if (this.target) {
      const shotData = actor.computeShotData(this.target);
      
      const data: ShotData = {
        velocityVector: shotData.velocityVector,
        orientation: shotData.orientation,
        startPos: shotData.startPos,
        position: shotData.startPos,
      };

      const shot = new Shot(world.shot, actor, data);
      script.entries.push(shot);

      actor.attack(
        this.target!,
        actor.character.equipped.rangeWeapon!,
        world,
        script,
      );

      if (world.trajectory) {
        world.mainRenderPass.removeDrawable(world.trajectory, 'trajectory');
        world.trajectory = null;
      }

      return true;
    }

    this.path = [];
    this.distance = 0;
    this.target = null;

    return false;
  }
}

export default RangeAttack;
