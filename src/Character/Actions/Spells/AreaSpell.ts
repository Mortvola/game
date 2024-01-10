import { Vec2, Vec4, mat4, quat, vec2, vec3, vec4 } from "wgpu-matrix";
import Circle from "../../../Drawables/Circle";
import { getWorld } from "../../../Main";
import { degToRad } from "../../../Math";
import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import { TimeType } from "../Action";
import Script from "../../../Script/Script";
import RangeSpell from "./RangeSpell";
import DrawableNode from "../../../Drawables/DrawableNode";

class AreaSpell extends RangeSpell {
  center: Vec2 | null = null;

  radius: number;

  areaOfEffect: DrawableNode | null = null;

  constructor(
    actor: Actor,
    name: string,
    time: TimeType,
    level: number,
    radius: number,
    range: number,
    duration: number,
    endOfTurn: boolean,
    concentration: boolean,
  ) {
    super(actor, 1, true, name, time, level, range, duration, endOfTurn, concentration)
    this.radius = radius;
  }

  clear() {
    super.clear();
    this.hideAreaOfEffect()
  }

  async prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): Promise<void> {
    this.showAreaOfEffect();

    if (point && this.areaOfEffect) {
      this.areaOfEffect.translate = vec3.create(point[0], 0, point[2])

      this.center = vec2.create(point[0], point[2]);
    }
  }

  async interact(script: Script, world: WorldInterface): Promise<boolean> {
    if (this.center !== null) {
      return this.castSpell(script);
    }

    return false;
  }

  showAreaOfEffect() {
    if (this.areaOfEffect === null) {
      const world = getWorld();

      this.areaOfEffect = new DrawableNode(new Circle(this.radius, 0.05, vec4.create(0.5, 0.5, 0.5, 1)))
      this.areaOfEffect.translate = vec3.copy(this.actor.sceneNode.translate)
  
      world.mainRenderPass.addDrawable(this.areaOfEffect, 'circle');
      world.scene.addNode(this.areaOfEffect, 'circle');
  
      const q = quat.fromEuler(degToRad(270), 0, 0, "xyz");
      this.areaOfEffect.postTransforms.push(mat4.fromQuat(q));  
    }
  }

  hideAreaOfEffect() {
    if (this.areaOfEffect) {
      const world = getWorld();
      world.mainRenderPass.removeDrawable(this.areaOfEffect, 'circle');
      world.scene.removeNode(this.areaOfEffect)
      this.areaOfEffect = null;
    }
  }
}

export default AreaSpell;
