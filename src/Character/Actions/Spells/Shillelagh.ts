import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import SelfSpell from "./SelfSpell";

class Shillelagh extends SelfSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Shillelagh', 'Bonus', 0, 60, false, false);
  }

  cast(script: Script, world: WorldInterface): boolean {
    this.actor.character.addInfluencingAction(this);

    return true;
  }
}

export default Shillelagh;
