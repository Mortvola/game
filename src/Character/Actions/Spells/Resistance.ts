import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import TouchSpell from "./TouchSpell";

class Resistance extends TouchSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Resistance', 'Action', 0, 0, 60, false, true)
  }

  cast(script: Script, world: WorldInterface): boolean {
    this.targets[0].character.addInfluencingSpell(this)

    if (world.loggerCallback) {
      world.loggerCallback(`${this.actor.character.name} cast ${this.name} on ${this.targets[0].character.name}.`)
    }

    return true;
  }
}

export default Resistance;
