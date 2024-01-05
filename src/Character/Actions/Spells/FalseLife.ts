import { diceRoll } from "../../../Dice";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import SelfSpell from "./SelfSpell";

class FalseLife extends SelfSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'False Life', 'Action', 1, 0, 60 * 60, false, false)
  }

  cast(script: Script, world: WorldInterface): boolean {
    this.actor.character.temporaryHitPoints = diceRoll(1, 4) + 4;
    this.actor.character.addInfluencingSpell(this)

    return true;
  }
}

export default FalseLife;
