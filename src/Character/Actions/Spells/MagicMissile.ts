import { Vec4 } from "wgpu-matrix";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from "../../../WorldInterface";
import { diceRoll } from "../../../Dice";

class MagicMissile extends Spell {
  castingTime = 1;

  range = feetToMeters(120);

  duration = 0;

  targets: Actor[] = [];

  constructor() {
    super('Magic Missle', 'Action', 1)
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    if (target) {
      this.target = target;
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

        return true;
      }
    }

    return false;
  }
}

export default MagicMissile;
