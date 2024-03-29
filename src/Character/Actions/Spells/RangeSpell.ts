import { Vec4, vec3, vec4 } from "wgpu-matrix";
import Spell from "./Spell";
import Script from "../../../Script/Script";
import { CreatureActorInterface, TimeType } from "../../../types";
import RangeCircle from "../../../Renderer/Drawables/RangeCircle";

class RangeSpell extends Spell {
  range: number;

  rangeCircle: RangeCircle | null = null;

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

  async prepareInteraction(target: CreatureActorInterface | null, point: Vec4 | null): Promise<void> {
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

    if (this.world.actionInfoCallback) {
      this.world.actionInfoCallback({
        action: this.name,
        description,
        percentSuccess: this.focused ? 100 : 0,
      })
    }              
  }

  async interact(script: Script): Promise<boolean> {
    if (this.focused) {
      this.targets.push(this.focused);
      this.focused = null;

      if (this.targets.length < this.maxTargets) {
        if (this.world.actionInfoCallback) {
          this.world.actionInfoCallback({
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
      this.rangeCircle = new RangeCircle(vec3.copy(this.actor.sceneObject.sceneNode.translate), this.range, 0.05)
  
      this.world.renderer.scene.addNode(this.rangeCircle);
    }
  }

  hideRangeCircle() {
    if (this.rangeCircle) {
      this.world.renderer.scene.removeNode(this.rangeCircle)
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
