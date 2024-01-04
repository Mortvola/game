import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import BladeWardCondition from '../Conditions/BladeWard';
import SelfSpell from "./SelfSpell";

class BladeWard extends SelfSpell {
  constructor(actor: Actor) {
    super(actor, 'Blade Ward', 'Action', 0, 0, 6, false)
  }

  cast(script: Script, world: WorldInterface) {
    this.actor.character.conditions.push(new BladeWardCondition())
  }
}

export default BladeWard;
