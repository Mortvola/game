import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";
import RangeSpell from "./RangeSpell";

class Bless extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 3, true, 'Bless', 'Action', 1, feetToMeters(30), 60, false, true)
  }
  
  cast(script: Script, world: WorldInterface): boolean {
    for (const target of this.targets) {
      target.character.addInfluencingAction(this)
        
      if (world.loggerCallback) {
        world.loggerCallback(`${this.actor.character.name} cast bless on ${target.character.name}.`)
      }
    }

    this.actor.character.concentration = this;

    return true;
  }
}

export default Bless;
