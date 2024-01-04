import { feetToMeters } from "../../../Math";
import Logger from "../../../Script/Logger";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import RangeSpell from "./RangeSpell";
import TrueStrikeCondition from "../Conditions/TrueStrike";

class TrueStrike extends RangeSpell {
  constructor() {
    super(1, true, 'True Strike', 'Action', 0, feetToMeters(30), 60, true);
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    this.targets[0].character.conditions.push(new TrueStrikeCondition(actor.character));
    script.entries.push(new Logger(`${actor.character.name} cast ${this.name} on ${this.targets[0].character.name}.`))

    actor.character.concentration = { name: this.name, targets: [this.targets[0].character] };
  }
}

export default TrueStrike;
