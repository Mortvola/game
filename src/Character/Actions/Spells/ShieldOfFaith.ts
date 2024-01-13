import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from '../../../types'
import Actor from "../../Actor";
import RangeSpell from "./RangeSpell";
import Logger from "../../../Script/Logger";

class ShieldOfFaith extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Shield of Faith', 'Bonus', 1, feetToMeters(60), 10 * 60, false, true);
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    this.targets[0].character.addInfluencingAction(this);

    script.entries.push(new Logger(`${this.actor.character.name} cast ${this.name} on ${this.targets[0].character.name}.`))

    this.actor.character.concentration = this;

    return true;
  }
}

export default ShieldOfFaith;
