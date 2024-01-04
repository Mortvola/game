import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import { diceRoll, spellAttackRoll } from "../../../Dice";
import Script from "../../../Script/Script";
import RangeSpell from "./RangeSpell";

class RayOfSickness extends RangeSpell {
  constructor() {
    super(1, true, 'Ray of Sickness', 'Action', 1, feetToMeters(60), 0, false)
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    const [damage, critical] = spellAttackRoll(
      actor.character,
      this.targets[0].character,
      actor.character.abilityScores.wisdom,
      () => diceRoll(2, 8),
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, actor, this.name, script);

    // TODO: Add constitution saving throw for poison.
  }
}

export default RayOfSickness;
