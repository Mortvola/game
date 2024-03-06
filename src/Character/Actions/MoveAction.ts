import { Vec2, Vec4, vec2 } from "wgpu-matrix";
import Script from "../../Script/Script";
import Action from "./Action";
import { findPath2 } from "../../Workers/PathPlannerQueue";
import FollowPath from "../../Script/FollowPath";
import { PathPoint } from "../../Workers/PathPlannerTypes";
import { CreatureActorInterface } from "../../types";

class MoveAction extends Action {
  path: PathPoint[] = [];

  distance = 0;

  constructor(actor: CreatureActorInterface) {
    super(actor, 0, 'Move', 'Move', 0, false)
  }

  async prepareInteraction(target: CreatureActorInterface | null, point: Vec4 | null): Promise<void> {
    if (this.trajectory) {
      this.world.renderer.scene.removeNode(this.trajectory);
      this.trajectory = null;
    }

    const wp = this.actor.getWorldPosition();
    
    // If there isn't a point but there is a target
    // then use the target's location.
    let targetWp: Vec2;

    if (target !== null || point !== null) {
      if (point) {
        targetWp = vec2.create(point[0], point[2])
      }
      else {
        const tmp = target!.getWorldPosition();
        targetWp = vec2.create(tmp[0], tmp[2])
      }

      const [path, distance, lines, cancelled] = await findPath2(
        vec2.create(wp[0], wp[2]),
        targetWp,
        target ? target.occupiedRadius + (target.attackRadius - target.occupiedRadius) * 0.75 : null,
        target,
        this.actor.distanceLeft,
        true,
      )

      if (!cancelled) { // && !this.target) {
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
    else {
      console.log('calling showPathLines(null)')
      await this.showPathLines(null);
    }
  }

  async interact(script: Script): Promise<boolean> {
    const path = this.actor.processPath(this.path, script);
    script.entries.push(new FollowPath(this.actor.sceneObject, path, this.world));    

    await this.showPathLines(null);

    if (this.world.actionInfoCallback) {
      this.world.actionInfoCallback(null)
    }              

    this.path = [];
    this.distance = 0;

    return true;
  }
}

export default MoveAction;
