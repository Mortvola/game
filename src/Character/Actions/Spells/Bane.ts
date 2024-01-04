import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import { savingThrow } from "../../../Dice";
import BaneCondition from '../Conditions/Bane';
import { Concentration } from "../../Creature";
import RangeSpell from "./RangeSpell";
import Script from "../../../Script/Script";

class Bane extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 3, true, 'Bane', 'Action', 1, feetToMeters(30), 60, true)
  }

  cast(script: Script, world: WorldInterface) {
    const concentration: Concentration = { name: this.name, targets: [] };

    for (const target of this.targets) {
      const st = savingThrow(target.character, target.character.abilityScores.charisma, 'Neutral');

      if (st < this.actor.character.spellCastingDc) {
        target.character.conditions.push(new BaneCondition())
        
        concentration.targets.push(target.character);

        if (world.loggerCallback) {
          world.loggerCallback(`${this.actor.character.name} cast bane on ${target.character.name}.`)
        }
      }
      else if (world.loggerCallback) {
        world.loggerCallback(`${this.actor.character.name} failed to cast bane on ${target.character.name}.`)
      }    
    }

    if (concentration.targets.length > 0) {          
      this.actor.character.concentration = concentration;
    }
  }
}

export default Bane;
