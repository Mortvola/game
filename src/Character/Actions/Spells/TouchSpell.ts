import { Vec4 } from "wgpu-matrix";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";

class TouchSpell extends Spell {
  async prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): Promise<void> {
    await this.prepareZeroDistAction(100, target, point, world);
  }

  interact(script: Script, world: WorldInterface): boolean {
    if (this.focused) {
      this.targets.push(this.focused)
      this.focused = null;
    }

    const result = this.zeroDistanceAction(script, world, () => {
      this.castSpell(script)
    });

    return result;
  }
}

export default TouchSpell;
