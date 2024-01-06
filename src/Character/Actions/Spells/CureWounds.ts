import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";
import { abilityModifier, diceRoll } from "../../../Dice";
import TouchSpell from "./TouchSpell";

class CureWounds extends TouchSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Cure Wounds', 'Action', 1, 0, false, false);
  }

  cast(script: Script, world: WorldInterface): boolean {
    this.targets[0].takeHealing(
      diceRoll(1, 8)
        + abilityModifier(this.actor.character.spellcastingAbilityScore),
      this.actor,
      this.name,
      script,
    )

    return true;
  }
}

export default CureWounds;
