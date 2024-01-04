import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import BladeWardCondition from '../Conditions/BladeWard';
import SelfSpell from "./SelfSpell";

class BladeWard extends SelfSpell {
  constructor() {
    super('Blade Ward', 'Action', 0, 0, 6, false)
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    actor.character.conditions.push(new BladeWardCondition())

    if (world.loggerCallback) {
      world.loggerCallback(`${actor.character.name} received ${this.name}.`)
    }
  }
}

export default BladeWard;
