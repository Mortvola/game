import { Vec2, Vec4, mat4, quat, vec2, vec3, vec4 } from "wgpu-matrix";
import Circle from "../../../Drawables/Circle";
import { degToRad, feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Spell from "./Spell";
import Actor from "../../Actor";

class Grease extends Spell {
  radius = feetToMeters(10);

  center: Vec2 | null = null;

  constructor(actor: Actor) {
    super(actor, 1, true, 'Grease', 'Action', 1, feetToMeters(60), 60, false)
  }

  prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface) {
    if (world.circleAoE === null) {
      world.circleAoE = new Circle(feetToMeters(10), 0.1, vec4.create(0.5, 0.5, 0.5, 1))
      world.mainRenderPass.addDrawable(world.circleAoE, 'circle');
      world.scene.addNode(world.circleAoE, 'circle');

      const q = quat.fromEuler(degToRad(270), 0, 0, "xyz");
      world.circleAoE.postTransforms.push(mat4.fromQuat(q));
    }

    if (point) {
      world.circleAoE.translate = vec3.create(point[0], 0, point[2])

      this.center = vec2.create(point[0], point[2]);
    }
  }

  interact(script: Script, world: WorldInterface): boolean {
    if (this.center !== null) {
      world.occupants.push({ center: this.center, radius: this.radius })

      if (this.level >= 1 && this.actor.character.spellSlots[this.level - 1] > 0) {
        this.actor.character.spellSlots[this.level - 1] -= 1;
      }

      return true;
    }

    return false;
  }
}

export default Grease;
