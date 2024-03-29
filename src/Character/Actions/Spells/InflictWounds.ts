import { CreatureActorInterface } from '../../../types'
import Script from "../../../Script/Script";
import { diceRoll, spellAttackRoll } from "../../../Dice";
import TouchSpell from "./TouchSpell";
import { DamageType } from "../../Equipment/Types";

class InflictWounds extends TouchSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Inflict Wounds', 'Action', 1, 0, false, false)
  }

  async cast(script: Script): Promise<boolean> {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.targets[0].character,
      () => diceRoll(3, 10),
      DamageType.Necrotic,
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, this.actor, this.name, script);

    return damage > 0;
  }
}

export default InflictWounds;
