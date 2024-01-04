import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import RangeSpell from "./RangeSpell";
import Script from "../../../Script/Script";
import { savingThrow } from "../../../Dice";
import TashasHideousLaughterCondition from "../Conditions/TashasHideousLaughter";

class TashasHideosLaughter extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Tasha\'s Hideous Laughter', 'Action', 1, feetToMeters(30), 60, true)
  }

  cast(script: Script, world: WorldInterface) {
    const st = savingThrow(this.targets[0].character, this.targets[0].character.abilityScores.wisdom, 'Neutral');

    if (st < this.actor.character.spellCastingDc) {
      this.targets[0].character.conditions.push(new TashasHideousLaughterCondition(this.actor.character))
      
      this.actor.character.concentration = { name: this.name, targets: [this.targets[0].character] }

      if (world.loggerCallback) {
        world.loggerCallback(`${this.actor.character.name} cast ${this.name} on ${this.targets[0].character.name}.`)
      }
    }
    else if (world.loggerCallback) {
      world.loggerCallback(`${this.actor.character.name} failed to cast ${this.name} on ${this.targets[0].character.name}.`)
    }    
  }
}

export default TashasHideosLaughter;
