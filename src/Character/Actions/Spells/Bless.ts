import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";
import { Concentration } from "../../Creature";
import BlessCondition from '../Conditions/Bless';
import RangeSpell from "./RangeSpell";

class Bless extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 3, true, 'Bless', 'Action', 1, feetToMeters(30), 60, true)
  }
  
  cast(script: Script, world: WorldInterface) {
    const concentration: Concentration = { name: this.name, targets: [] };

    for (const target of this.targets) {
      target.character.conditions.push(new BlessCondition())
        
      concentration.targets.push(target.character);

      if (world.loggerCallback) {
        world.loggerCallback(`${this.actor.character.name} cast bless on ${target.character.name}.`)
      }
    }

    if (concentration.targets.length > 0) {          
      this.actor.character.concentration = concentration;
    }
  }
}

export default Bless;
