import { Vec4, vec2 } from "wgpu-matrix";
import Script from "../../Script/Script";
import Action from "./Action";
import Trajectory from "../../Renderer/Drawables/Trajectory";
import { findPath2 } from "../../Workers/PathPlannerQueue";
import Shot from "../../Script/Shot";
import FollowPath from "../../Script/FollowPath";
import DrawableNode from "../../Renderer/Drawables/SceneNodes/DrawableNode";
import { CreatureActorInterface, ShotData } from "../../types";
import { trajectoryMaterial } from "../../Renderer/Materials/Trajectory";
import { sceneObjectlManager } from "../../SceneObjectManager";

class RangeAttack extends Action {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, 'Range', 'Action', 0, false)
  }
  
  async prepareInteraction(target: CreatureActorInterface | null, point: Vec4 | null): Promise<void> {
    if (target) {
      const result = this.actor.computeShotData(target);
      
      if (this.trajectory) {
        this.world.renderer.scene.removeNode(this.trajectory);
        this.trajectory = null;
      }
    
      this.trajectory = await DrawableNode.create(new Trajectory({
        velocityVector: result.velocityVector,
        duration: result.duration ?? 0,
        startPos: result.startPos,
        orientation: result.orientation,
        distance: result.distance,
      }), { shaderDescriptor: trajectoryMaterial });
  
      this.world.renderer.scene.addNode(this.trajectory);
  
      await this.showPathLines(null);
  
      if (this.world.actionInfoCallback) {
        this.world.actionInfoCallback({
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
        this.world.renderer.scene.removeNode(this.trajectory);
        this.trajectory = null;
      }

      if (point) {
        const wp = this.actor.getWorldPosition();
        
        let targetWp = vec2.create(point[0], point[2]);

        const [path, distance, lines, cancelled] = await findPath2(
          vec2.create(wp[0], wp[2]),
          targetWp,
          null,
          target,
          this.actor.distanceLeft,
          true,
        )

        if (!cancelled && !this.focused) {
          await this.showPathLines(lines);

          this.path = path;
          this.distance = distance;

          if (this.world.actionInfoCallback) {
            this.world.actionInfoCallback({
              action: 'Move',
              percentSuccess: null,
            })
          }              
        }
      }  
    }
  }

  async interact(script: Script): Promise<boolean> {
    if (this.path.length > 0) {
      const path = this.actor.processPath(this.path, script);
      script.entries.push(new FollowPath(this.actor.sceneObject, path, this.world));    

      await this.showPathLines(null);
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
        distance: shotData.distance,
      };

      const shot = await sceneObjectlManager.getSceneObject('Shot', this.world);

      script.entries.push(new Shot(shot, this.actor, data, this.world));

      this.actor.attack(
        this.targets[0],
        this.actor.character.equipped.rangeWeapon!,
        script,
      );

      if (this.trajectory) {
        this.world.renderer.scene.removeNode(this.trajectory);
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
