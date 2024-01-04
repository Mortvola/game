import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import SelfSpell from "./SelfSpell";

class Shillelagh extends SelfSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Shillelagh', 'Bonus', 0, 0, 60, false);
  }

  cast(script: Script, world: WorldInterface) {
    this.actor.character.addInfluencingSpell(this);
  }
}

export default Shillelagh;
