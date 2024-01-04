import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";
import { abilityModifier, diceRoll } from "../../../Dice";
import { feetToMeters } from "../../../Math";
import RangeSpell from "./RangeSpell";

class HealingWord extends RangeSpell {
  constructor() {
    super(1, true, 'Healing Word', 'Bonus', 1, feetToMeters(60), 0, false);
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    this.targets[0].takeHealing(
      diceRoll(1, 4) + abilityModifier(actor.character.spellcastingAbilityScore),
      actor,
      this.name,
      script,
    )
  }
}

export default HealingWord;
