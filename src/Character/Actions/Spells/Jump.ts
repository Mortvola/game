import Script from "../../../Script/Script";
import { WorldInterface } from '../../../types'
import Actor from "../../Actor";
import TouchSpell from "./TouchSpell";

class Jump extends TouchSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Jump', 'Action', 1, 60, false, false);
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    this.targets[0].character.addInfluencingAction(this);

    return true;
  }
}

export default Jump;
