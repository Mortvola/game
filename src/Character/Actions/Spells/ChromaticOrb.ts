import { diceRoll, spellAttackRoll } from "../../../Dice";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import { DamageType } from "../../Equipment/Weapon";
import RangeSpell from "./RangeSpell";

class ChromaticOrb extends RangeSpell {
  constructor() {
    super(1, true, 'Chromatic Orb', 'Action', 1, feetToMeters(90), 0, false)
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    const [damage, critical] = spellAttackRoll(
      actor.character,
      this.targets[0].character,
      () => diceRoll(3, 8),
      DamageType.Fire, // TODO: make this selectable.
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, actor, this.name, script);
  }
}

export default ChromaticOrb;
