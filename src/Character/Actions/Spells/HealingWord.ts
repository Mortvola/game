import { CreatureActorInterface } from '../../../types'
import Script from "../../../Script/Script";
import { abilityModifier, diceRoll } from "../../../Dice";
import { feetToMeters } from "../../../Renderer/Math";
import RangeSpell from "./RangeSpell";
import { modelManager } from '../../../ModelManager';

class HealingWord extends RangeSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Healing Word', 'Bonus', 1, feetToMeters(60), 0, false, false);
  }

  async cast(script: Script): Promise<boolean> {
    const soulercoaster = await modelManager.getModel('SoulerCoaster');

    soulercoaster.translate = this.targets[0].getWorldPosition();
    
    this.world.renderer.scene.addNode(soulercoaster);

    this.targets[0].takeHealing(
      diceRoll(1, 4) + abilityModifier(this.actor.character.spellcastingAbilityScore),
      this.actor,
      this.name,
      script,
    )

    return true;
  }
}

export default HealingWord;
