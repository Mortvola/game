import { Vec4, mat4, quat, vec3, vec4 } from "wgpu-matrix";
import Spell from "./Spell";
import Script from "../../../Script/Script";
import { getWorld } from "../../../Main";
import Circle from "../../../Renderer/Drawables/Circle";
import { degToRad } from "../../../Math";
import DrawableNode from "../../../Renderer/Drawables/SceneNodes/DrawableNode";
import { CreatureActorInterface, TimeType, WorldInterface } from "../../../types";
import { circleMaterial } from "../../../Renderer/Materials/Circle";

class RangeSpell extends Spell {
  range: number;

  rangeCircle: DrawableNode | null = null;

  constructor(
    actor: CreatureActorInterface,
    maxTargets: number,
    uniqueTargets: boolean,
    name: string,
    time: TimeType,
    level: number,
    range: number,
    duration: number,
    endOfTurn: boolean,
    concentration: boolean,
  ) {
    super(actor, maxTargets, uniqueTargets, name, time, level, duration, endOfTurn, concentration);
    this.range = range;
  }

  initialize() {
    this.showRangeCircle();
  }

  clear() {
    super.clear();
    this.hideRangeCircle();
  }

  async prepareInteraction(target: CreatureActorInterface | null, point: Vec4 | null, world: WorldInterface): Promise<void> {
    let description = `Select ${this.maxTargets  - this.targets.length} more targets.`;

    if (this.maxTargets === 1) {
      description = `Select 1 target.`;
    }

    if (target && (!this.uniqueTargets || !this.targets.includes(target))) {
      if (this.withinRange(target)) {
        this.focused = target;
      }
      else {
        this.focused = null;
        description = 'Target is out of range.'
      }
    }
    else {
      this.focused = null;
    }

    if (world.actionInfoCallback) {
      world.actionInfoCallback({
        action: this.name,
        description,
        percentSuccess: this.focused ? 100 : 0,
      })
    }              
  }

  async interact(script: Script, world: WorldInterface): Promise<boolean> {
    if (this.focused) {
      this.targets.push(this.focused);
      this.focused = null;

      if (this.targets.length < this.maxTargets) {
        if (world.actionInfoCallback) {
          world.actionInfoCallback({
            action: this.name,
            description: `Select ${this.maxTargets - this.targets.length} more targets.`,
            percentSuccess: 100,
          })          
        }
      }
      else {
        return this.castSpell(script);
      }
    }

    return false;
  }

  async showRangeCircle() {
    if (this.range > 0) {
      const world = getWorld();

      this.rangeCircle = await DrawableNode.create(new Circle(this.range, 0.05, vec4.create(0.5, 0.5, 0.5, 1)), circleMaterial)
      this.rangeCircle.translate = vec3.copy(this.actor.sceneNode.translate)
  
      world.scene.addNode(this.rangeCircle);
  
      const q = quat.fromEuler(degToRad(270), 0, 0, "xyz");
      this.rangeCircle.postTransforms.push(mat4.fromQuat(q));  
    }
  }

  hideRangeCircle() {
    if (this.rangeCircle) {
      const world = getWorld();
      world.scene.removeNode(this.rangeCircle)
      this.rangeCircle = null;
    }
  }

  withinRange(target: CreatureActorInterface) {
    const wp = this.actor.getWorldPosition();
    const targetWp = target.getWorldPosition();

    const distance = vec3.distance(wp, targetWp);

    return (distance <= this.range);
  }
}

export default RangeSpell;
