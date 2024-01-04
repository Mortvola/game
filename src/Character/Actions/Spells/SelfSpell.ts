import { Vec4 } from "wgpu-matrix";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";

class SelfSpell extends Spell {
  prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    let success = 0;

    if (this.actor === target) {
      this.target = target;
      success = 100;  
    }

    if (world.actionInfoCallback) {
      world.actionInfoCallback({
        action: this.name,
        description: `Select ${this.actor.character.name} to confirm.`,
        percentSuccess: success,
      })
    }              
  }

  interact(script: Script, world: WorldInterface): boolean {
    if (this.target && this.actor === this.target) {
      this.cast(script, world);

      if (world.loggerCallback) {
        world.loggerCallback(`${this.actor.character.name} received ${this.name}.`)
      }
  
      if (world.actionInfoCallback) {
        world.actionInfoCallback(null);
      }

      if (this.level >= 1 && this.actor.character.spellSlots[this.level - 1] > 0) {
        this.actor.character.spellSlots[this.level - 1] -= 1;
      }

      return true;
    }

    return false;
  }
}

export default SelfSpell;
