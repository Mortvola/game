import { Vec4 } from "wgpu-matrix";
import Spell from "./Spell";
import { CreatureActorInterface, WorldInterface } from '../../../types'
import Script from "../../../Script/Script";

class SelfSpell extends Spell {
  async prepareInteraction(target: CreatureActorInterface | null, point: Vec4 | null, world: WorldInterface): Promise<void> {
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

  async interact(script: Script, world: WorldInterface): Promise<boolean> {
    if (this.focused && this.actor === this.focused) {
      this.targets.push(this.focused);
      this.focused = null;
      
      return this.castSpell(script);
    }

    return false;
  }
}

export default SelfSpell;
