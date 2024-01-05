import { feetToMeters } from "../../../Math";
import Logger from "../../../Script/Logger";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import RangeSpell from "./RangeSpell";

class TrueStrike extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'True Strike', 'Action', 0, feetToMeters(30), 60, false, true);
  }

  cast(script: Script, world: WorldInterface): boolean {
    this.targets[0].character.addInfluencingSpell(this);

    script.entries.push(new Logger(`${this.actor.character.name} cast ${this.name} on ${this.targets[0].character.name}.`))

    this.actor.character.concentration = this;

    return true;
  }
}

export default TrueStrike;
