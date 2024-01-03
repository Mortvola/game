import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import { abilityModifier, getProficiencyBonus, savingThrow } from "../../../Dice";
import BaneCondition from '../Conditions/Bane';
import { Concentration } from "../../Creature";
import RangeSpell from "./RangeSpell";
import Script from "../../../Script/Script";

class Bane extends RangeSpell {
  constructor() {
    super(3, true, 'Bane', 'Action', 1, feetToMeters(30), 60, true)
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    const concentration: Concentration = { name: this.name, targets: [] };

    for (const target of this.targets) {
      const st = savingThrow(target.character, target.character.abilityScores.charisma, 'Neutral');
      const dc = 8 + getProficiencyBonus(actor.character.charClass.level) + abilityModifier(actor.character.abilityScores.wisdom);

      if (st < dc) {
        target.character.conditions.push(new BaneCondition())
        
        concentration.targets.push(target.character);

        if (world.loggerCallback) {
          world.loggerCallback(`${actor.character.name} cast bane on ${target.character.name}.`)
        }
      }
      else if (world.loggerCallback) {
        world.loggerCallback(`${actor.character.name} failed to cast bane on ${target.character.name}.`)
      }    
    }

    if (concentration.targets.length > 0) {          
      actor.character.concentration = concentration;
    }
  }
}

export default Bane;
