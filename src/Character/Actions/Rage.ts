import { Vec4 } from "wgpu-matrix";
import Action from "./Action";
import Script from "../../Script/Script";
import { CreatureActorInterface } from "../../types";

class Rage extends Action {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, 'Rage', 'Bonus', 60, false)
  }

  async prepareInteraction(target: CreatureActorInterface | null, point: Vec4 | null): Promise<void> {
    let success = 0;

    if (this.actor === target && !target.character.hasInfluencingAction('Rage')) {
      this.focused = target;
      success = 100;  
    }

    if (this.world.actionInfoCallback) {
      this.world.actionInfoCallback({
        action: this.name,
        description: `Select ${this.actor.character.name} to confirm.`,
        percentSuccess: success,
      })
    }              
  }

  async interact(script: Script): Promise<boolean> {
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
