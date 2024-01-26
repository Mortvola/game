import { Vec4 } from "wgpu-matrix";
import Spell from "./Spell";
import { CreatureActorInterface } from '../../../types'
import Script from "../../../Script/Script";

class TouchSpell extends Spell {
  async prepareInteraction(target: CreatureActorInterface | null, point: Vec4 | null): Promise<void> {
    await this.prepareZeroDistAction(100, target, point);
  }

  async interact(script: Script): Promise<boolean> {
    if (this.focused) {
      this.targets.push(this.focused)
      this.focused = null;
    }

    const result = this.zeroDistanceAction(script, async () => {
      return this.castSpell(script)
    });

    return result;
  }
}

export default TouchSpell;
