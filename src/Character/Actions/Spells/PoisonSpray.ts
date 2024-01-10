import { diceRoll, savingThrow } from "../../../Dice";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import RangeSpell from "./RangeSpell";

class PoisonSpray extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Poison Spray', 'Action', 0, feetToMeters(10), 0, false, false);
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    const st = savingThrow(this.targets[0].character, this.targets[0].character.abilityScores.constitution, 'Neutral');

    let damage = 0;
    if (st < this.actor.character.spellCastingDc) {
      damage = diceRoll(1, 12);
    }

    this.targets[0].takeDamage(damage, false, this.actor, this.name, script);

    return damage > 0;
  }
}

export default PoisonSpray;
