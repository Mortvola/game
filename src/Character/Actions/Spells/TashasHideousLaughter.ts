import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import RangeSpell from "./RangeSpell";
import Script from "../../../Script/Script";
import { savingThrow } from "../../../Dice";

class TashasHideosLaughter extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Tasha\'s Hideous Laughter', 'Action', 1, feetToMeters(30), 60, false, true)
  }

  cast(script: Script, world: WorldInterface): boolean {
    const st = savingThrow(this.targets[0].character, this.targets[0].character.abilityScores.wisdom, 'Neutral');

    if (st < this.actor.character.spellCastingDc) {
      this.targets[0].character.addInfluencingAction(this);

      this.actor.character.concentration = this;

      if (world.loggerCallback) {
        world.loggerCallback(`${this.actor.character.name} cast ${this.name} on ${this.targets[0].character.name}.`)
      }

      return true;
    }
    
    if (world.loggerCallback) {
      world.loggerCallback(`${this.actor.character.name} failed to cast ${this.name} on ${this.targets[0].character.name}.`)
    }    

    return false;
  }
}

export default TashasHideosLaughter;
