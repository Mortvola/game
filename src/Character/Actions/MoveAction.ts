import { Vec2, Vec4, vec2 } from "wgpu-matrix";
import Script from "../../Script/Script";
import { WorldInterface } from "../../WorldInterface";
import Action from "./Action";
import Actor from "../Actor";
import { findPath2 } from "../../Workers/PathPlannerQueue";
import FollowPath from "../../Script/FollowPath";
import { PathPoint } from "../../Workers/PathPlannerTypes";
import { savingThrow } from "../../Dice";
import Logger from "../../Script/Logger";

class MoveAction extends Action {
  path: PathPoint[] = [];

  distance = 0;

  constructor(actor: Actor) {
    super(actor, 0, 'Move', 'Move', 0, false)
  }

  async prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): Promise<void> {
    if (this.trajectory) {
      world.mainRenderPass.removeDrawable(this.trajectory, 'trajectory');
      this.trajectory = null;
    }

    const wp = this.actor.getWorldPosition();
    
    // If there isn't a point but there is a target
    // then use the target's location.
    let targetWp: Vec2;

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
  }

  async interact(script: Script, world: WorldInterface): Promise<boolean> {
    const path = this.actor.processPath(this.path, script);
    script.entries.push(new FollowPath(this.actor.sceneNode, path));    

    this.showPathLines(null);

    if (world.actionInfoCallback) {
      world.actionInfoCallback(null)
    }              

    this.path = [];
    this.distance = 0;

    return true;
  }
}

export default MoveAction;
