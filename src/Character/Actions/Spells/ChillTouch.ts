import { diceRoll, spellAttackRoll } from "../../../Dice";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import { DamageType } from "../../Equipment/Weapon";
import RangeSpell from "./RangeSpell";

class ChillTouch extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Chill Touch', 'Action', 0, feetToMeters(120), 6, false);
  }

  cast(script: Script, world: WorldInterface) {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.targets[0].character,
      () => diceRoll(1, 8),
      DamageType.Necrotic,
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, this.actor, this.name, script);

    if (damage > 0) {
      this.targets[0].character.addInfluencingSpell(this);
    }

    // TODO: apply disadvantage to undead.
  }
}

export default ChillTouch;
