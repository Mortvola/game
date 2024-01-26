import { Vec4 } from "wgpu-matrix";
import Spell from "./Spell";
import { CreatureActorInterface } from '../../../types'
import Script from "../../../Script/Script";

class SelfSpell extends Spell {
  async prepareInteraction(target: CreatureActorInterface | null, point: Vec4 | null): Promise<void> {
    let success = 0;

    if (this.actor === target) {
      this.focused = target;
      success = 100;  
    }

    if (this.world.actionInfoCallback) {
      this.world.actionInfoCallback({
        action: this.name,
        description: `Select ${this.actor.character.name} to confirm.`,
        percentSuccess: success,
      })
    }              
  }

  async interact(script: Script): Promise<boolean> {
    if (this.focused && this.actor === this.focused) {
      this.targets.push(this.focused);
      this.focused = null;
      
      return this.castSpell(script);
    }

    return false;
  }
}

export default SelfSpell;
