import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import { abilityModifier, getProficiencyBonus, savingThrow } from "../../../Dice";
import BaneCondition from '../Conditions/Bane';
import RangeSpell from "./RangeSpell";
import Script from "../../../Script/Script";

class TashasHideosLaughter extends RangeSpell {
  constructor() {
    super(1, true, 'Tasha\'s Hideous Laughter', 'Action', 1, feetToMeters(30), 60, true)
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    const st = savingThrow(this.targets[0].character, this.targets[0].character.abilityScores.wisdom, 'Neutral');
    const dc = 8 + getProficiencyBonus(actor.character.charClass.level) + abilityModifier(actor.character.abilityScores.wisdom);

    if (st < dc) {
      this.targets[0].character.conditions.push(new BaneCondition())
      
      actor.character.concentration = { name: 'Tashas Hideous Laughter', targets: [this.targets[0].character] }

      if (world.loggerCallback) {
        world.loggerCallback(`${actor.character.name} cast Tasha's Hideous Laughter on ${this.targets[0].character.name}.`)
      }
    }
    else if (world.loggerCallback) {
      world.loggerCallback(`${actor.character.name} failed to cast Tasha's Hideous Laughter on ${this.targets[0].character.name}.`)
    }    
  }
}

export default TashasHideosLaughter;
