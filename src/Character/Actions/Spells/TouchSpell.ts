import { Vec4 } from "wgpu-matrix";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from '../../../types'
import Script from "../../../Script/Script";

class TouchSpell extends Spell {
  async prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): Promise<void> {
    await this.prepareZeroDistAction(100, target, point, world);
  }

  async interact(script: Script, world: WorldInterface): Promise<boolean> {
    if (this.focused) {
      this.targets.push(this.focused)
      this.focused = null;
    }

    const result = this.zeroDistanceAction(script, world, async () => {
      return this.castSpell(script)
    });

    return result;
  }
}

export default TouchSpell;
