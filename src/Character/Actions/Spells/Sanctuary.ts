import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";
import SanctuaryCondition from '../Conditions/Sanctuary'
import Logger from "../../../Script/Logger";
import { feetToMeters } from "../../../Math";
import RangeSpell from "./RangeSpell";

class Sanctuary extends RangeSpell {
  constructor() {
    super(1, true, 'Sanctuary', 'Bonus', 1, feetToMeters(30), 60, false);
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    this.targets[0].character.conditions.push(new SanctuaryCondition())
    script.entries.push(new Logger(`${actor.character.name} cast ${this.name} on ${this.targets[0].character.name}.`))
  }
}

export default Sanctuary;
