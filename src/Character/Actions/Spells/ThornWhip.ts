import { diceRoll, spellAttackRoll } from "../../../Dice";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { CreatureActorInterface, WorldInterface } from '../../../types'
import { DamageType } from "../../Equipment/Types";
import RangeSpell from "./RangeSpell";

class ThornWhip extends RangeSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Thorn Whip', 'Action', 0, feetToMeters(30), 0, false, false);
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.targets[0].character,
      () => diceRoll(1, 6),
      DamageType.Piercing,
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, this.actor, this.name, script);
    
    // TODO: move target up to 10 feet closer if size is large or smaller.

    return damage > 0;
  }
}

export default ThornWhip;
