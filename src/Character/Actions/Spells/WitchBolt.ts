import { diceRoll, spellAttackRoll } from "../../../Dice";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import RangeSpell from "./RangeSpell";

class WitchBolt extends RangeSpell {
  constructor() {
    super(1, true, 'Witch Bolt', 'Action', 1, feetToMeters(30), 60, true);
  }

  cast(actor: Actor, script: Script, wolrd: WorldInterface) {
    const [damage, critical] = spellAttackRoll(
      actor.character,
      this.targets[0].character,
      actor.character.abilityScores.wisdom,
      () => diceRoll(1, 12),
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, actor, this.name, script);

    if (damage) {
      actor.character.concentration = { name: this.name, targets: [this.targets[0].character] };
    }
  }
}

export default WitchBolt;
