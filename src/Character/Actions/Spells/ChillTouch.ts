import { diceRoll, spellAttackRoll } from "../../../Dice";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import { DamageType } from "../../Equipment/Weapon";
import RangeSpell from "./RangeSpell";
import ChillTouchCondition from '../Conditions/ChillTouch';

class ChillTouch extends RangeSpell {
  constructor() {
    super(1, true, 'Chill Touch', 'Action', 0, feetToMeters(120), 6, false);
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    const [damage, critical] = spellAttackRoll(
      actor.character,
      this.targets[0].character,
      () => diceRoll(1, 8),
      DamageType.Necrotic,
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, actor, this.name, script);

    if (damage > 0) {
      this.targets[0].character.conditions.push(new ChillTouchCondition());
    }

    // TODO: apply disadvantage to undead.
  }
}

export default ChillTouch;
