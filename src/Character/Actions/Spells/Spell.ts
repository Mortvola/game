import { Vec4, mat4, quat, vec3, vec4 } from "wgpu-matrix";
import { degToRad } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Action, { TimeType } from "../Action";
import Actor from "../../Actor";
import Circle from "../../../Drawables/Circle";
import { getWorld } from "../../../Renderer";
import { ActorInterface } from "../../../ActorInterface";

class Spell extends Action {
  level: number;

  castingTime = 1;

  range: number;

  duration: number;

  concentration: boolean;

  rangeCircle: Circle | null = null;

  constructor(name: string, time: TimeType, level: number, range: number, duration: number, concentration: boolean) {
    super(name, time);
    this.level = level;
    this.range = range;
    this.duration = duration;
    this.concentration = concentration;
  }

  initialize(actor: Actor) {
    this.showRangeCircle(actor);
  }

  clear() {
    this.hideRangeCircle(getWorld());
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
  }

  interact(actor: Actor, script: Script, world: WorldInterface): boolean {
    return true;
  }

  showRangeCircle(actor: Actor) {
    if (this.range > 0) {
      const world = getWorld();

      this.rangeCircle = new Circle(this.range, 0.05, vec4.create(0.5, 0.5, 0.5, 1))
      this.rangeCircle.translate = vec3.copy(actor.sceneNode.translate)
  
      world.mainRenderPass.addDrawable(this.rangeCircle, 'circle');
      world.scene.addNode(this.rangeCircle, 'circle');
  
      const q = quat.fromEuler(degToRad(270), 0, 0, "xyz");
      this.rangeCircle.postTransforms.push(mat4.fromQuat(q));  
    }
  }

  hideRangeCircle(world: WorldInterface) {
    if (this.rangeCircle) {
      world.mainRenderPass.removeDrawable(this.rangeCircle, 'circle');
      world.scene.removeNode(this.rangeCircle)
      this.rangeCircle = null;
    }
  }

  withinRange(actor: Actor, target: Actor) {
    const wp = actor.getWorldPosition();
    const targetWp = target.getWorldPosition();

    const distance = vec3.distance(wp, targetWp);

    return (distance <= this.range);
  }
}

export default Spell;
