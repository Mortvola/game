import { Vec4 } from "wgpu-matrix";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";

class SelfSpell extends Spell {
  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    let success = 0;

    if (actor === target) {
      this.target = target;
      success = 100;  
    }

    if (world.actionInfoCallback) {
      world.actionInfoCallback({
        action: this.name,
        description: `Select ${actor.character.name} to confirm.`,
        percentSuccess: success,
      })
    }              
  }

  interact(actor: Actor, script: Script, world: WorldInterface): boolean {
    if (this.target && actor === this.target) {
      this.cast(actor, script, world);

      if (world.actionInfoCallback) {
        world.actionInfoCallback(null);
      }

      if (this.level >= 1 && actor.character.spellSlots[this.level - 1] > 0) {
        actor.character.spellSlots[this.level - 1] -= 1;
      }

      return true;
    }

    return false;
  }
}

export default SelfSpell;
