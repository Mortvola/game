import { diceRoll, spellAttackRoll } from "../../../Dice";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import { DamageType } from "../../Equipment/Weapon";
import RangeSpell from "./RangeSpell";

class ChromaticOrb extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Chromatic Orb', 'Action', 1, feetToMeters(90), 0, false)
  }

  cast(script: Script, world: WorldInterface) {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.targets[0].character,
      () => diceRoll(3, 8),
      DamageType.Fire, // TODO: make this selectable.
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, this.actor, this.name, script);
  }
}

export default ChromaticOrb;
