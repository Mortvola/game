import { Vec4 } from "wgpu-matrix";
import Script from "../../Script/Script";
import Action from "./Action";
import { ActionFactory, CreatureActorInterface } from "../../types";

class MeleeAttack extends Action {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, 'Melee', 'Action', 0, false)
  }
  
  async prepareInteraction(target: CreatureActorInterface | null, point: Vec4 | null): Promise<void> {
    let actionPercent = 0;

    if (target) {
      actionPercent = this.actor.character.percentSuccess(target.character, this.actor.character.equipped.meleeWeapon!);
    }

    await this.prepareZeroDistAction(actionPercent, target, point);
  }

  async interact(script: Script): Promise<boolean> {
    if (this.focused) {
      this.targets.push(this.focused);
      this.focused = null;
    }

    return this.zeroDistanceAction(script, async () => {
      this.actor.attack(
        this.targets[0],
        this.actor.character.equipped.meleeWeapon!,
        script,
      );

      return true;
    });
  }
}

export const meleeAttack = new ActionFactory(MeleeAttack, 'Melee Attack', 'Action')
