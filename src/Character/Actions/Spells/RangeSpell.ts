import { Vec4 } from "wgpu-matrix";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from "../../../WorldInterface";
import { TimeType } from "../Action";
import Script from "../../../Script/Script";

class RangeSpell extends Spell {
  targets: Actor[] = [];

  maxTargets: number;

  uniqueTargets: boolean;

  constructor(
    maxTargets: number,
    uniqueTargets: boolean,
    name: string,
    time: TimeType,
    level: number,
    range: number,
    duration: number,
    concentration: boolean,
  ) {
    super(name, time, level, range, duration, concentration)
    this.maxTargets = maxTargets;
    this.uniqueTargets = uniqueTargets;
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    let description = `Select ${this.maxTargets  - this.targets.length} more targets.`;

    if (this.maxTargets === 1) {
      description = `Select 1 target.`;
    }

    if (target && (!this.uniqueTargets || !this.targets.includes(target))) {
      if (this.withinRange(actor, target)) {
        this.target = target;
      }
      else {
        this.target = null;
        description = 'Target is out of range.'
      }
    }
    else {
      this.target = null;
    }

    if (world.actionInfoCallback) {
      world.actionInfoCallback({
        action: this.name,
        description,
        percentSuccess: this.target ? 100 : 0,
      })
    }              
  }

  interact(actor: Actor, script: Script, world: WorldInterface) {
    if (this.target) {
      this.targets.push(this.target);
      this.target = null;

      if (this.targets.length < this.maxTargets) {
        if (world.actionInfoCallback) {
          world.actionInfoCallback({
            action: this.name,
            description: `Select ${this.maxTargets - this.targets.length} more targets.`,
            percentSuccess: 100,
          })          
        }
      }
      else {
        // End concentration of the curren spell if this spell 
        // requires concentration.
        if (this.concentration) {
          actor.character.stopConcentrating();
        }

        this.cast(actor, script, world);

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

export default RangeSpell;
