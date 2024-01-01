import { Vec2, Vec4, mat4, quat, vec2, vec3, vec4 } from "wgpu-matrix";
import Circle from "../../../Drawables/Circle";
import { degToRad, feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Spell from "./Spell";
import Actor from "../../Actor";

class Grease extends Spell {
  castingTime = 1;

  range = feetToMeters(60);

  duration = 60;

  radius = feetToMeters(10);

  center: Vec2 | null = null;

  constructor() {
    super('Grease', 'Action', 1)
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface) {
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

  interact(actor: Actor, script: Script, world: WorldInterface): boolean {
    if (this.center !== null) {
      world.occupants.push({ center: this.center, radius: this.radius })

      return true;
    }

    return false;
  }
}

export default Grease;
