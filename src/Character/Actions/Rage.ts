import { Vec4 } from "wgpu-matrix";
import Actor from "../Actor";
import Action from "./Action";
import { WorldInterface } from "../../WorldInterface";
import Script from "../../Script/Script";

class Rage extends Action {
  constructor(actor: Actor) {
    super(actor, 1, 'Rage', 'Bonus', 60, false)
  }

  async prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): Promise<void> {
    let success = 0;

    if (this.actor === target && !target.character.hasInfluencingAction('Rage')) {
      this.focused = target;
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

  async interact(script: Script, world: WorldInterface): Promise<boolean> {
    if (this.focused && this.actor === this.focused) {
      this.targets.push(this.focused);
      this.focused = null;
      
      this.actor.character.addInfluencingAction(this)
      this.actor.character.enduringActions.push(this)
      return true;
    }

    return false;
  }
}

export default Rage;
