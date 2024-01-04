import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import Logger from "../../../Script/Logger";
import MageArmorCondition from "../Conditions/MageArmor";
import TouchSpell from "./TouchSpell";

class MageArmor extends TouchSpell {
  constructor() {
    super('Mage Armor', 'Action', 1, 0, 8 * 60 * 60, false)
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    this.target?.character.conditions.push(new MageArmorCondition());

    script.entries.push(new Logger(`${actor.character.name} cast ${this.name} on ${this.target?.character.name}.`))
  }
}

export default MageArmor;
