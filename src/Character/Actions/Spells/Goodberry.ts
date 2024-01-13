import Script from "../../../Script/Script";
import { CreatureActorInterface, WorldInterface } from '../../../types'
import TouchSpell from "./TouchSpell";

class Goodberry extends TouchSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Goodberry', 'Action', 1, 0, false, false);
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    return true;
  }
}

export default Goodberry;
