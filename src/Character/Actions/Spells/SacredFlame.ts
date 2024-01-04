import { diceRoll, savingThrow } from "../../../Dice";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import RangeSpell from "./RangeSpell";

class SacredFlame extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Sacred Flame', 'Action', 0, feetToMeters(60), 0, false);
  }

  cast(script: Script, world: WorldInterface) {
    const st = savingThrow(this.targets[0].character, this.targets[0].character.abilityScores.dexterity, 'Neutral');

    let damage = 0;
    if (st < this.actor.character.spellCastingDc) {
      damage = diceRoll(1, 8);
    }

    this.targets[0].takeDamage(damage, false, this.actor, this.name, script);
  }
}

export default SacredFlame;
