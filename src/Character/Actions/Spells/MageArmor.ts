import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import Logger from "../../../Script/Logger";
import TouchSpell from "./TouchSpell";

class MageArmor extends TouchSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Mage Armor', 'Action', 1, 0, 8 * 60 * 60, false)
  }

  cast(script: Script, world: WorldInterface) {
    this.target?.character.addInfluencingSpell(this);

    script.entries.push(new Logger(`${this.actor.character.name} cast ${this.name} on ${this.target?.character.name}.`))
  }
}

export default MageArmor;
