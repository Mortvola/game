import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import SelfSpell from "./SelfSpell";
import ShillelaghCondition from "../Conditions/Shillelagh";

class Shillelagh extends SelfSpell {
  constructor(actor: Actor) {
    super(actor, 'Shillelagh', 'Bonus', 0, 0, 60, false);
  }

  cast(script: Script, world: WorldInterface) {
    this.actor.character.conditions.push(new ShillelaghCondition())
  }
}

export default Shillelagh;
