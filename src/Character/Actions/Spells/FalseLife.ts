import { diceRoll } from "../../../Dice";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import SelfSpell from "./SelfSpell";

class FalseLife extends SelfSpell {
  constructor() {
    super('False Life', 'Action', 1, 0, 60 * 60, false)
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    actor.character.temporaryHitPoints = diceRoll(1, 4) + 4;
  }
}

export default FalseLife;
