import { Vec4 } from "wgpu-matrix";
import Actor from "../Actor";
import Action from "./Action";
import { WorldInterface } from "../../WorldInterface";
import Script from "../../Script/Script";
import RageCondition from './Conditions/Rage'

class Rage extends Action {
  constructor() {
    super('Rage', 'Bonus')
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    let success = 0;

    if (actor === target && !target.character.hasCondition('Rage')) {
      this.target = target;
      success = 100;  
    }

    if (world.actionInfoCallback) {
      world.actionInfoCallback({
        action: this.name,
        description: `Select ${actor.character.name} to confirm.`,
        percentSuccess: success,
      })
    }              
  }

  interact(actor: Actor, script: Script, world: WorldInterface): boolean {
    if (this.target && actor === this.target) {
      actor.character.conditions.push(new RageCondition())
    }

    return true;
  }
}

export default Rage;
