import { Vec4, mat4, quat, vec3, vec4 } from "wgpu-matrix";
import { degToRad } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Action, { TimeType } from "../Action";
import Actor from "../../Actor";
import Circle from "../../../Drawables/Circle";
import { getWorld } from "../../../Renderer";

class Spell extends Action {
  level: number;

  castingTime = 1;

  range: number;

  duration: number;

  concentration: boolean;

  targets: Actor[] = [];

  maxTargets: number;

  uniqueTargets: boolean;

  rangeCircle: Circle | null = null;

  constructor(
    actor: Actor,
    maxTargets: number,
    uniqueTargets: boolean,
    name: string,
    time: TimeType,
    level: number,
    range: number,
    duration: number,
    concentration: boolean,
  ) {
    super(actor, name, time);

    this.maxTargets = maxTargets;
    this.uniqueTargets = uniqueTargets;
    this.level = level;
    this.range = range;
    this.duration = duration;
    this.concentration = concentration;
  }

  initialize() {
    this.showRangeCircle();
  }

  clear() {
    super.clear();
    this.hideRangeCircle(getWorld());
  }

  cast(script: Script, world: WorldInterface) {
  }

  prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
  }

  interact(script: Script, world: WorldInterface): boolean {
    return true;
  }

  showRangeCircle() {
    if (this.range > 0) {
      const world = getWorld();

      this.rangeCircle = new Circle(this.range, 0.05, vec4.create(0.5, 0.5, 0.5, 1))
      this.rangeCircle.translate = vec3.copy(this.actor.sceneNode.translate)
  
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

  withinRange(target: Actor) {
    const wp = this.actor.getWorldPosition();
    const targetWp = target.getWorldPosition();

    const distance = vec3.distance(wp, targetWp);

    return (distance <= this.range);
  }
}

export default Spell;
