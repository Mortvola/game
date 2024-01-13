import { diceRoll } from "../../../Dice";
import Script from "../../../Script/Script";
import { CreatureActorInterface, WorldInterface } from '../../../types'
import SelfSpell from "./SelfSpell";

class FalseLife extends SelfSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'False Life', 'Action', 1, 60 * 60, false, false)
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    this.actor.character.temporaryHitPoints = diceRoll(1, 4) + 4;
    this.actor.character.addInfluencingAction(this)

    return true;
  }
}

export default FalseLife;
