import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import Logger from "../../../Script/Logger";
import TouchSpell from "./TouchSpell";

class MageArmor extends TouchSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Mage Armor', 'Action', 1, 8 * 60 * 60, false, false)
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    this.targets[0].character.addInfluencingAction(this);

    script.entries.push(new Logger(`${this.actor.character.name} cast ${this.name} on ${this.targets[0].character.name}.`))

    return true;
  }
}

export default MageArmor;
