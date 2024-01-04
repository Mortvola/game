import { diceRoll, savingThrow } from "../../../Dice";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import RangeSpell from "./RangeSpell";

class PoisonSpray extends RangeSpell {
  constructor() {
    super(1, true, 'Poison Spray', 'Action', 0, feetToMeters(10), 0, false);
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    const st = savingThrow(this.targets[0].character, this.targets[0].character.abilityScores.constitution, 'Neutral');

    if (st < actor.character.spellCastingDc) {
      this.targets[0].takeDamage(diceRoll(1, 12), false, actor, this.name, script);
    }
  }
}

export default PoisonSpray;
