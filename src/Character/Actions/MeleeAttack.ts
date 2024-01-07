import { Vec4 } from "wgpu-matrix";
import Script from "../../Script/Script";
import { WorldInterface } from "../../WorldInterface";
import Action from "./Action";
import Actor from "../Actor";

class MeleeAttack extends Action {
  constructor(actor: Actor) {
    super(actor, 1, 'Melee', 'Action', 0, false)
  }
  
  async prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): Promise<void> {
    let actionPercent = 0;

    if (target) {
      actionPercent = this.actor.character.percentSuccess(target.character, this.actor.character.equipped.meleeWeapon!);
    }

    await this.prepareZeroDistAction(actionPercent, target, point, world);
  }

  interact(script: Script, world: WorldInterface): boolean {
    if (this.focused) {
      this.targets.push(this.focused);
      this.focused = null;
    }

    return this.zeroDistanceAction(script, world, () => {
      this.actor.attack(
        this.targets[0],
        this.actor.character.equipped.meleeWeapon!,
        world,
        script,
      );
    });
  }
}

export default MeleeAttack;
