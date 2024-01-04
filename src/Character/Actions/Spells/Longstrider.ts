import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import TouchSpell from "./TouchSpell";
import LongstriderCondition from '../Conditions/Longstrider';

class Longstrider extends TouchSpell {
  constructor() {
    super('Longstrider', 'Action', 1, 0, 60 * 60, false);
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    this.target!.character.conditions.push(new LongstriderCondition());

    if (world.loggerCallback) {
      world.loggerCallback(`${actor.character.name} cast ${this.name} on ${this.target!.character.name}.`)
    }
  }
}

export default Longstrider;
