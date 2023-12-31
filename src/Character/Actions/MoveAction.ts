import { Vec2, Vec4, vec2 } from "wgpu-matrix";
import Script from "../../Script/Script";
import { WorldInterface } from "../../WorldInterface";
import Action from "./Action";
import Actor from "../Actor";
import { findPath2, getOccupants } from "../../Workers/PathPlannerQueue";
import Line from "../../Drawables/Line";
import FollowPath from "../../Script/FollowPath";

class MoveAction extends Action {
  type: 'Melee' | 'MoveAndMelee' | 'Move' | 'None' = 'None';

  path: Vec2[] = [];

  distance = 0;

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    if (world.trajectory) {
      world.mainRenderPass.removeDrawable(world.trajectory, 'trajectory');
      world.trajectory = null;
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

        this.type = 'Move';
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

  interact(actor: Actor, script: Script, world: WorldInterface): void {
    script.entries.push(new FollowPath(actor.sceneNode, this.path));    
    actor.distanceLeft -= this.distance;

    if (world.pathLines) {
      world.mainRenderPass.removeDrawable(world.pathLines, 'line');
    }

    if (world.actionInfoCallback) {
      world.actionInfoCallback(null)
    }              

    this.type = 'None';
    this.path = [];
    this.distance = 0;
  }
}

export default MoveAction;
