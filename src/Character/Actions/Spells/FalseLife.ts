import { diceRoll } from "../../../Dice";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import SelfSpell from "./SelfSpell";

class FalseLife extends SelfSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'False Life', 'Action', 1, 0, 60 * 60, false)
  }

  cast(script: Script, world: WorldInterface) {
    this.actor.character.temporaryHitPoints = diceRoll(1, 4) + 4;
  }
}

export default FalseLife;
