import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import SelfSpell from "./SelfSpell";

class ExpeditiousRetreat extends SelfSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Expeditious Retreat', 'Bonus', 1, 0, 10 * 60, true)
  }

  cast(script: Script, world: WorldInterface) {
    this.actor.character.addInfluencingSpell(this);
  }
}

export default ExpeditiousRetreat;
