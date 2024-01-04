import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import TouchSpell from "./TouchSpell";
import ResistanceCondition from "../Conditions/Resistance";

class Resistance extends TouchSpell {
  constructor() {
    super('Resistance', 'Action', 0, 0, 60, true)
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    this.target!.character.conditions.push(new ResistanceCondition());

    if (world.loggerCallback) {
      world.loggerCallback(`${actor.character.name} cast ${this.name} on ${this.target!.character.name}.`)
    }
  }
}

export default Resistance;
