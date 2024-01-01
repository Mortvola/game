import { Vec4 } from "wgpu-matrix";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";
import { abilityModifier, diceRoll } from "../../../Dice";

class HealingWord extends Spell {
  constructor() {
    super('Healing Word', 'Bonus')
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    if (target) {
      this.target = target;
    }

    if (world.actionInfoCallback) {
      world.actionInfoCallback({
        action: this.name,
        description: `Select 1 target.`,
        percentSuccess: target ? 100 : 0,
      })
    }              
  }

  interact(actor: Actor, script: Script, world: WorldInterface) {
    if (this.target) {
      this.target.takeHealing(
        diceRoll(1, 4) + abilityModifier(actor.character.abilityScores.wisdom),
        actor,
        this.name,
        script,
      )

      if (world.actionInfoCallback) {
        world.actionInfoCallback(null);
      }

      if (actor.actionsLeft > 0) {
        actor.actionsLeft -= 1;
      }
    }
  }
}

export default HealingWord;
