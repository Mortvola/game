import Script from "../../../Script/Script";
import { CreatureActorInterface } from '../../../types'
import SelfSpell from "./SelfSpell";

class ExpeditiousRetreat extends SelfSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Expeditious Retreat', 'Bonus', 1, 10 * 60, false, true)
  }

  async cast(script: Script): Promise<boolean> {
    this.actor.character.addInfluencingAction(this);

    return true;
  }
}

export default ExpeditiousRetreat;
