import { Vec4 } from "wgpu-matrix";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from "../../../WorldInterface";
import { diceRoll } from "../../../Dice";

class MagicMissile extends Spell {
  targets: Actor[] = [];

  constructor() {
    super('Magic Missile', 'Action', 1, feetToMeters(120), 0, false)
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    if (target) {
      this.target = target;
    }
    else {
      this.target = null;
    }

    if (world.actionInfoCallback) {
      world.actionInfoCallback({
        action: this.name,
        description: `Select ${3 - this.targets.length} more targets.`,
        percentSuccess: target ? 100 : 0,
      })
    }              
  }

  interact(actor: Actor, script: Script, world: WorldInterface) {
    if (this.target) {
      this.targets.push(this.target);
      this.target = null;

      if (this.targets.length < 3) {
        if (world.actionInfoCallback) {
          world.actionInfoCallback({
            action: this.name,
            description: `Select ${3 - this.targets.length} more targets.`,
            percentSuccess: 100,
          })          
        }
      }
      else {
        for (const target of this.targets) {
          target.takeDamage(diceRoll(1, 4) + 1, false, actor, 'Magic Missle', script)
        }

        if (world.actionInfoCallback) {
          world.actionInfoCallback(null);
        }

        if (this.level >= 1 && actor.character.spellSlots[this.level - 1] > 0) {
          actor.character.spellSlots[this.level - 1] -= 1;
        }

        return true;
      }
    }

    return false;
  }
}

export default MagicMissile;
