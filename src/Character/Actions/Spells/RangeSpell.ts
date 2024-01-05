import { Vec4 } from "wgpu-matrix";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";

class RangeSpell extends Spell {
  prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
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

  interact(script: Script, world: WorldInterface) {
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
        // End concentration of the curren spell if this spell 
        // requires concentration.
        if (this.concentration) {
          this.actor.character.stopConcentrating();
        }

        if (this.cast(script, world) && this.duration > 0) {
          this.actor.character.enduringActions.push(this);
        }

        if (world.actionInfoCallback) {
          world.actionInfoCallback(null);
        }

        if (this.level >= 1 && this.actor.character.spellSlots[this.level - 1] > 0) {
          this.actor.character.spellSlots[this.level - 1] -= 1;
        }

        return true;
      }
    }

    return false;
  }
}

export default RangeSpell;
