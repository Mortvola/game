import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";
import RangeSpell from "./RangeSpell";

class Bless extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 3, true, 'Bless', 'Action', 1, feetToMeters(30), 60, true)
  }
  
  cast(script: Script, world: WorldInterface) {
    for (const target of this.targets) {
      target.character.addInfluencingSpell(this)
        
      if (world.loggerCallback) {
        world.loggerCallback(`${this.actor.character.name} cast bless on ${target.character.name}.`)
      }
    }

    if (this.targets.length > 0) {          
      this.actor.character.concentration = this;
    }
  }
}

export default Bless;
