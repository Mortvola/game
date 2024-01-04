import { diceRoll, spellAttackRoll } from "../../../Dice";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import RangeSpell from "./RangeSpell";

class FalseLife extends RangeSpell {
  constructor() {
    super(1, true, 'False Life', 'Action', 1, 0, 60 * 60, false)
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    // const [damage, critical] = spellAttackRoll(
    //   actor.character,
    //   this.targets[0].character,
    //   actor.character.abilityScores.wisdom,
    //   () => diceRoll(3, 8),
    //   'Neutral'
    // )

    // this.targets[0].takeDamage(damage, critical, actor, this.name, script);
  }
}

export default FalseLife;
