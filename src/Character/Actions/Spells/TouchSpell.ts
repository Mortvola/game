import { Vec4 } from "wgpu-matrix";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";

class TouchSpell extends Spell {
  prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    this.prepareZeroDistAction(100, target, point, world);
  }

  interact(script: Script, world: WorldInterface): boolean {
    const result = this.zeroDistanceAction(script, world, () => {
      this.cast(script, world);
    });

    if (result) {
      if (this.level >= 1 && this.actor.character.spellSlots[this.level - 1] > 0) {
        this.actor.character.spellSlots[this.level - 1] -= 1;
      }
    }

    return result;
  }
}

export default TouchSpell;
