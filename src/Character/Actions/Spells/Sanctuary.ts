import Actor from "../../Actor";
import { WorldInterface } from '../../../types'
import Script from "../../../Script/Script";
import Logger from "../../../Script/Logger";
import { feetToMeters } from "../../../Math";
import RangeSpell from "./RangeSpell";

class Sanctuary extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Sanctuary', 'Bonus', 1, feetToMeters(30), 60, false, false);
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    this.targets[0].character.addInfluencingAction(this);

    script.entries.push(new Logger(`${this.actor.character.name} cast ${this.name} on ${this.targets[0].character.name}.`))

    return true;
  }
}

export default Sanctuary;
