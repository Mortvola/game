import { Vec4 } from "wgpu-matrix";
import Script from "../../Script/Script";
import { WorldInterface } from "../../WorldInterface";
import Action from "./Action";
import Actor from "../Actor";

class MeleeAttack extends Action {
  constructor(actor: Actor) {
    super(actor, 'Melee', 'Action')
  }
  
  prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    let actionPercent = 0;

    if (target) {
      actionPercent = this.actor.character.percentSuccess(target.character, this.actor.character.equipped.meleeWeapon!);
    }

    this.prepareZeroDistAction(actionPercent, target, point, world);
  }

  interact(script: Script, world: WorldInterface): boolean {
    return this.zeroDistanceAction(script, world, () => {
      this.actor.attack(
        this.target!,
        this.actor.character.equipped.meleeWeapon!,
        world,
        script,
      );
    });
  }
}

export default MeleeAttack;
