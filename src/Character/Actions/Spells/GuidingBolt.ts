import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import { diceRoll, spellAttackRoll } from "../../../Dice";
import Script from "../../../Script/Script";
import RangeSpell from "./RangeSpell";

class GuidingBolt extends RangeSpell {
  constructor() {
    super(1, true, 'Guiding Bolt', 'Action', 1, feetToMeters(120), 6, false)
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    const [damage, critical] = spellAttackRoll(
      actor.character,
      this.targets[0].character,
      actor.character.abilityScores.wisdom,
      () => diceRoll(4, 6),
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, actor, this.name, script);
  }
}

export default GuidingBolt;
