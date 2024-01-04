import { Vec4 } from "wgpu-matrix";
import Actor from "../Actor";
import Action from "./Action";
import { WorldInterface } from "../../WorldInterface";
import Script from "../../Script/Script";
import RageCondition from './Conditions/Rage'

class Rage extends Action {
  constructor(actor: Actor) {
    super(actor, 'Rage', 'Bonus')
  }

  prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    let success = 0;

    if (this.actor === target && !target.character.hasCondition('Rage')) {
      this.target = target;
      success = 100;  
    }

    if (world.actionInfoCallback) {
      world.actionInfoCallback({
        action: this.name,
        description: `Select ${this.actor.character.name} to confirm.`,
        percentSuccess: success,
      })
    }              
  }

  interact(script: Script, world: WorldInterface): boolean {
    if (this.target && this.actor === this.target) {
      this.actor.character.conditions.push(new RageCondition())

      return true;
    }

    return false;
  }
}

export default Rage;
