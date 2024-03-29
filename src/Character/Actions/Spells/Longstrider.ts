import Script from "../../../Script/Script";
import { CreatureActorInterface } from '../../../types'
import TouchSpell from "./TouchSpell";

class Longstrider extends TouchSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Longstrider', 'Action', 1, 60 * 60, false, false);
  }

  async cast(script: Script): Promise<boolean> {
    this.targets[0].character.addInfluencingAction(this);

    if (this.world.loggerCallback) {
      this.world.loggerCallback(`${this.actor.character.name} cast ${this.name} on ${this.targets[0].character.name}.`)
    }

    return true;
  }
}

export default Longstrider;
