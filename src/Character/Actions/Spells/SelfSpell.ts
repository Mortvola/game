import { Vec4 } from "wgpu-matrix";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";

class SelfSpell extends Spell {
  async prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): Promise<void> {
    let success = 0;

    if (this.actor === target) {
      this.focused = target;
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
    if (this.focused && this.actor === this.focused) {
      this.targets.push(this.focused);
      this.focused = null;
      
      if (this.cast(script, world) && this.duration > 0) {
        this.actor.character.enduringActions.push(this);
      }

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
