import Script from "../../../Script/Script";
import { WorldInterface } from '../../../types'
import Actor from "../../Actor";
import SelfSpell from "./SelfSpell";

class ExpeditiousRetreat extends SelfSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Expeditious Retreat', 'Bonus', 1, 10 * 60, false, true)
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    this.actor.character.addInfluencingAction(this);

    return true;
  }
}

export default ExpeditiousRetreat;
