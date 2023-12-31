import { Vec4 } from "wgpu-matrix";
import Script from "../../Script/Script";
import { WorldInterface } from "../../WorldInterface";
import Action from "./Action";
import Actor from "../Actor";

class MeleeAttack extends Action {
  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    let actionPercent = 0;

    if (target) {
      actionPercent = actor.character.percentSuccess(target.character, actor.character.equipped.meleeWeapon!);
    }

    this.prepareZeroDistAction('Melee', actionPercent, actor, target, point, world);
  }

  interact(actor: Actor, script: Script, world: WorldInterface): void {
    this.zeroDistanceAction(actor, script, world, () => {
      actor.attack(
        this.target!,
        actor.character.equipped.meleeWeapon!,
        world,
        script,
      );

      if (actor.actionsLeft > 0) {
        actor.actionsLeft -= 1;
      }    
    });
  }
}

export default MeleeAttack;
