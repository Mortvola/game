import Script from "../../../Script/Script";
import { CreatureActorInterface } from '../../../types'
import SelfSpell from "./SelfSpell";

class Shillelagh extends SelfSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Shillelagh', 'Bonus', 0, 60, false, false);
  }

  async cast(script: Script): Promise<boolean> {
    this.actor.character.addInfluencingAction(this);

    return true;
  }
}

export default Shillelagh;
