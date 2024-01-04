import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import SelfSpell from "./SelfSpell";
import ShillelaghCondition from "../Conditions/Shillelagh";

class Shillelagh extends SelfSpell {
  constructor() {
    super('Shillelagh', 'Bonus', 0, 0, 60, false);
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    actor.character.conditions.push(new ShillelaghCondition())
  }
}

export default Shillelagh;
