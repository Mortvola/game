import { Vec2, Vec4, vec2 } from "wgpu-matrix";
import Script from "../../Script/Script";
import { WorldInterface } from "../../WorldInterface";
import Action from "./Action";
import Actor from "../Actor";
import { findPath2, getOccupants } from "../../Workers/PathPlannerQueue";
import Line from "../../Drawables/Line";
import FollowPath from "../../Script/FollowPath";

class MoveAction extends Action {
  path: Vec2[] = [];

  distance = 0;

  constructor() {
    super('Move', 'Move')
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    if (this.trajectory) {
      world.mainRenderPass.removeDrawable(this.trajectory, 'trajectory');
      this.trajectory = null;
    }

    const wp = actor.getWorldPosition();
    
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

    let participants = world.participants.turns.filter((a) => a.character.hitPoints > 0);
    const occupants = getOccupants(actor, target, participants, []);

    (async () => {  
      const [path, distance, lines, cancelled] = await findPath2(
        actor,
        vec2.create(wp[0], wp[2]),
        targetWp,
        target ? target.occupiedRadius + actor.occupiedRadius : null,
        target, occupants,
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
    })();
  }

  interact(actor: Actor, script: Script, world: WorldInterface): boolean {
    script.entries.push(new FollowPath(actor.sceneNode, this.path));    
    actor.distanceLeft -= this.distance;

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
