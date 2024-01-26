import Script from "../../../Script/Script";
import { CreatureActorInterface } from '../../../types'
import TouchSpell from "./TouchSpell";

class Jump extends TouchSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Jump', 'Action', 1, 60, false, false);
  }

  async cast(script: Script): Promise<boolean> {
    this.targets[0].character.addInfluencingAction(this);

    return true;
  }
}

export default Jump;
