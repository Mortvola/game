import { CreatureActorInterface } from '../../types'
import Script from "../../Script/Script";
import Action from './Action';
import { Vec4 } from 'wgpu-matrix';

class LayOnHands extends Action {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, 'Lay on Hands', 'Action', 0, false);
  }

  async prepareInteraction(target: CreatureActorInterface | null, point: Vec4 | null): Promise<void> {
    await this.prepareZeroDistAction(100, target, point);
  }

  async interact(script: Script): Promise<boolean> {
    if (this.focused) {
      this.targets.push(this.focused);
      this.focused = null;
    }

    return this.zeroDistanceAction(script, async () => {
      this.targets[0].takeHealing(
        5, // TODO: Make this variable.
        this.actor,
        this.name,
        script,
      )

      return true;
    });
  }
}

export default LayOnHands;
