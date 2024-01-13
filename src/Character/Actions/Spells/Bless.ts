import { feetToMeters } from "../../../Math";
import { CreatureActorInterface, WorldInterface } from '../../../types'
import Script from "../../../Script/Script";
import RangeSpell from "./RangeSpell";

class Bless extends RangeSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 3, true, 'Bless', 'Action', 1, feetToMeters(30), 60, false, true)
  }
  
  async cast(script: Script, world: WorldInterface): Promise<boolean> {
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
