import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import TouchSpell from "./TouchSpell";

class Longstrider extends TouchSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Longstrider', 'Action', 1, 0, 60 * 60, false);
  }

  cast(script: Script, world: WorldInterface) {
    this.target!.character.addInfluencingSpell(this);

    if (world.loggerCallback) {
      world.loggerCallback(`${this.actor.character.name} cast ${this.name} on ${this.target!.character.name}.`)
    }
  }
}

export default Longstrider;
