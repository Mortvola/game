import { diceRoll, spellAttackRoll } from "../../../Dice";
import { feetToMeters } from "../../../Renderer/Math";
import Script from "../../../Script/Script";
import { CreatureActorInterface, WorldInterface } from '../../../types'
import { DamageType } from "../../Equipment/Types";
import RangeSpell from "./RangeSpell";

class RayOfFrost extends RangeSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Ray of Frost', 'Action', 0, feetToMeters(60), 0, false, false);
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.targets[0].character,
      () => diceRoll(1, 8),
      DamageType.Cold,
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, this.actor, this.name, script);

    return damage > 0;
  }
}

export default RayOfFrost;
