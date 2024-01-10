import { diceRoll, spellAttackRoll } from "../../../Dice";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import { DamageType } from "../../Equipment/Weapon";
import RangeSpell from "./RangeSpell";

class WitchBolt extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Witch Bolt', 'Action', 1, feetToMeters(30), 60, false, true);
  }

  async cast(script: Script, wolrd: WorldInterface): Promise<boolean> {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.targets[0].character,
      () => diceRoll(1, 12),
      DamageType.Lightning,
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, this.actor, this.name, script);

    if (damage) {
      this.actor.character.concentration = this;

      return true;
    }

    return false;
  }
}

export default WitchBolt;
