import { diceRoll, spellAttackRoll } from "../../../Dice";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import { DamageType } from "../../Equipment/Weapon";
import RangeSpell from "./RangeSpell";

class FireBolt extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Fire Bolt', 'Action', 0, feetToMeters(120), 0, false);
  }

  cast(script: Script, world:WorldInterface) {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.targets[0].character,
      () => diceRoll(1, 10),
      DamageType.Fire,
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, this.actor, this.name, script);
  }
}

export default FireBolt;
