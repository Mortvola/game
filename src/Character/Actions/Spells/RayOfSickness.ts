import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import { diceRoll, savingThrow, spellAttackRoll } from "../../../Dice";
import Script from "../../../Script/Script";
import RangeSpell from "./RangeSpell";
import { DamageType } from "../../Equipment/Weapon";

class RayOfSickness extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Ray of Sickness', 'Action', 1, feetToMeters(60), 0, false)
  }

  cast(script: Script, world: WorldInterface) {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.targets[0].character,
      () => diceRoll(2, 8),
      DamageType.Poison,
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, this.actor, this.name, script);

    if (damage > 0) {
      const st = savingThrow(this.targets[0].character, this.targets[0].character.abilityScores.constitution, 'Neutral');

      if (st < this.actor.character.spellCastingDc) {
        this.targets[0].character.addInfluencingSpell(this);
      }
    }
  }
}

export default RayOfSickness;
