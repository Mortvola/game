import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import { diceRoll, spellAttackRoll } from "../../../Dice";
import Script from "../../../Script/Script";
import RangeSpell from "./RangeSpell";
import { DamageType } from "../../Equipment/Weapon";

class GuidingBolt extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Guiding Bolt', 'Action', 1, feetToMeters(120), 6, true, false)
  }

  cast(script: Script, world: WorldInterface): boolean {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.targets[0].character,
      () => diceRoll(4, 6),
      DamageType.Radiant,
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, this.actor, this.name, script);

    if (damage > 0) {
      this.targets[0].character.addInfluencingSpell(this);

      return true;
    }

    return false;
  }
}

export default GuidingBolt;
