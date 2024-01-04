import { diceRoll, spellAttackRoll } from "../../../Dice";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import { DamageType } from "../../Equipment/Weapon";
import RangeSpell from "./RangeSpell";

class ThornWhip extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Thorn Whip', 'Action', 0, feetToMeters(30), 0, false);
  }

  cast(script: Script, world: WorldInterface) {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.target!.character,
      () => diceRoll(1, 6),
      DamageType.Piercing,
      'Neutral'
    )

    this.target!.takeDamage(damage, critical, this.actor, this.name, script);
    
    // TODO: move target up to 10 feet closer if size is large or smaller.
  }
}

export default ThornWhip;
