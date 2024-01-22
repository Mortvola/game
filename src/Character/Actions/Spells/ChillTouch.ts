import { diceRoll, spellAttackRoll } from "../../../Dice";
import { feetToMeters } from "../../../Renderer/Math";
import Script from "../../../Script/Script";
import { CreatureActorInterface, WorldInterface } from '../../../types'
import { DamageType } from "../../Equipment/Types";
import RangeSpell from "./RangeSpell";

class ChillTouch extends RangeSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Chill Touch', 'Action', 0, feetToMeters(120), 6, false, false);
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.targets[0].character,
      () => diceRoll(1, 8),
      DamageType.Necrotic,
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, this.actor, this.name, script);

    if (damage > 0) {
      this.targets[0].character.addInfluencingAction(this);
    }

    // TODO: apply disadvantage to undead.

    return damage > 0;
  }
}

export default ChillTouch;
