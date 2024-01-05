import { Vec4, vec2 } from "wgpu-matrix";
import Script from "../../Script/Script";
import { WorldInterface } from "../../WorldInterface";
import Action from "./Action";
import Actor from "../Actor";
import Trajectory from "../../Drawables/Trajectory";
import { findPath2 } from "../../Workers/PathPlannerQueue";
import Shot, { ShotData } from "../../Script/Shot";
import FollowPath from "../../Script/FollowPath";

class RangeAttack extends Action {
  constructor(actor: Actor) {
    super(actor, 1, 'Range', 'Action', 0, false)
  }
  
  prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    if (target) {
      const result = this.actor.computeShotData(target);
      
      if (this.trajectory) {
        world.mainRenderPass.removeDrawable(this.trajectory, 'trajectory');
        this.trajectory = null;
      }
    
      this.trajectory = new Trajectory({
        velocityVector: result.velocityVector,
        duration: result.duration,
        startPos: result.startPos,
        orientation: result.orientation,
        distance: result.distance,
      });
  
      world.mainRenderPass.addDrawable(this.trajectory, 'trajectory');
  
      this.showPathLines(null);
  
      if (world.actionInfoCallback) {
        world.actionInfoCallback({
          action: this.name,
          percentSuccess: this.actor.character.percentSuccess(target.character, this.actor.character.equipped.rangeWeapon!),
        })
      }

      this.focused = target;
      this.path = [];
      this.distance = 0;
    }
    else {
      this.focused = null;

      if (this.trajectory) {
        world.mainRenderPass.removeDrawable(this.trajectory, 'trajectory');
        this.trajectory = null;
      }

      if (point) {
        const wp = this.actor.getWorldPosition();
        
        let targetWp = vec2.create(point[0], point[2]);

        (async () => {  

          const [path, distance, lines, cancelled] = await findPath2(
            this.actor,
            vec2.create(wp[0], wp[2]),
            targetWp,
            null,
            target,
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

  interact(script: Script, world: WorldInterface): boolean {
    if (this.path.length > 0) {
      script.entries.push(new FollowPath(this.actor.sceneNode, this.path));    
      this.actor.distanceLeft -= this.distance;

      this.showPathLines(null);
    }
    else if (this.focused) {
      this.targets.push(this.focused);
      this.focused = null;

      const shotData = this.actor.computeShotData(this.targets[0]);
      
      const data: ShotData = {
        velocityVector: shotData.velocityVector,
        orientation: shotData.orientation,
        startPos: shotData.startPos,
        position: shotData.startPos,
      };

      const shot = new Shot(world.shot, this.actor, data);
      script.entries.push(shot);

      this.actor.attack(
        this.targets[0],
        this.actor.character.equipped.rangeWeapon!,
        world,
        script,
      );

      if (this.trajectory) {
        world.mainRenderPass.removeDrawable(this.trajectory, 'trajectory');
        this.trajectory = null;
      }

      return true;
    }

    this.path = [];
    this.distance = 0;
    this.targets = [];

    return false;
  }
}

export default RangeAttack;
