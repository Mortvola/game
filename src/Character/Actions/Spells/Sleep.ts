import { feetToMeters } from "../../../Renderer/Math";
import Script from "../../../Script/Script";
import { CreatureActorInterface, WorldInterface } from '../../../types'
import AreaSpell from "./AreaSpell";

class Sleep extends AreaSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 'Sleep', 'Action', 1, feetToMeters(20), feetToMeters(90), 60, false, false)
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    return true;
  }
}

export default Sleep;
