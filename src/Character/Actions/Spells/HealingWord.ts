import { Vec4, vec3 } from "wgpu-matrix";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";
import { abilityModifier, diceRoll } from "../../../Dice";
import { feetToMeters } from "../../../Math";

class HealingWord extends Spell {
  constructor() {
    super('Healing Word', 'Bonus', 1, feetToMeters(60), 0, false);
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    if (this.rangeCircle === null) {
      this.showRangeCircle(actor)
    }

    if (target && this.withinRange(actor, target)) {
      this.target = target;
    }
    else {
      this.target = null;
    }

    if (world.actionInfoCallback) {
      world.actionInfoCallback({
        action: this.name,
        description: `Select 1 target.`,
        percentSuccess: this.target ? 100 : 0,
      })
    }              
  }

  interact(actor: Actor, script: Script, world: WorldInterface): boolean {
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

      this.hideRangeCircle(world);

      if (this.level >= 1 && actor.character.spellSlots[this.level - 1] > 0) {
        actor.character.spellSlots[this.level - 1] -= 1;
      }
  
      return true;
    }

    return false;
  }
}

export default HealingWord;
