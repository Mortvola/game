import { CreatureActorInterface, WorldInterface } from '../../../types'
import Script from "../../../Script/Script";
import { abilityModifier, diceRoll } from "../../../Dice";
import TouchSpell from "./TouchSpell";

class CureWounds extends TouchSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Cure Wounds', 'Action', 1, 0, false, false);
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
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
