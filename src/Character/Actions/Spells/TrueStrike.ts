import { feetToMeters } from "../../../Renderer/Math";
import Logger from "../../../Script/Logger";
import Script from "../../../Script/Script";
import { CreatureActorInterface } from '../../../types'
import RangeSpell from "./RangeSpell";

class TrueStrike extends RangeSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'True Strike', 'Action', 0, feetToMeters(30), 60, false, true);
  }

  async cast(script: Script): Promise<boolean> {
    this.targets[0].character.addInfluencingAction(this);

    script.entries.push(new Logger(`${this.actor.character.name} cast ${this.name} on ${this.targets[0].character.name}.`, this.world))

    this.actor.character.concentration = this;

    return true;
  }
}

export default TrueStrike;
