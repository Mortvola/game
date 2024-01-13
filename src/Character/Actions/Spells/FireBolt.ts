import { diceRoll, spellAttackRoll } from "../../../Dice";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { CreatureActorInterface, WorldInterface } from '../../../types'
import { DamageType } from "../../Equipment/Weapon";
import RangeSpell from "./RangeSpell";

class FireBolt extends RangeSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Fire Bolt', 'Action', 0, feetToMeters(120), 0, false, false);
  }

  async cast(script: Script, world:WorldInterface): Promise<boolean> {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.targets[0].character,
      () => diceRoll(1, 10),
      DamageType.Fire,
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, this.actor, this.name, script);

    return damage > 0;
  }
}

export default FireBolt;
