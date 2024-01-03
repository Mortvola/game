import { Vec4 } from "wgpu-matrix";
import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";
import { Concentration } from "../../Creature";
import { abilityModifier, getProficiencyBonus, savingThrow } from "../../../Dice";
import BlessCondition from '../Conditions/Bless';

class Bless extends Spell {
  targets: Actor[] = [];

  maxTargets = 3;

  constructor() {
    super('Bless', 'Action', 1, feetToMeters(30), 60, true)
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    let description = `Select ${this.maxTargets  - this.targets.length} more targets.`;

    if (target && !this.targets.includes(target)) {
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
        actor.character.stopConcentrating();

        const concentration: Concentration = { name: this.name, targets: [] };

        for (const target of this.targets) {
          target.character.conditions.push(new BlessCondition())
            
          concentration.targets.push(target.character);

          if (world.loggerCallback) {
            world.loggerCallback(`${actor.character.name} cast bless on ${target.character.name}.`)
          }
        }

        if (concentration.targets.length > 0) {          
          actor.character.concentration = concentration;
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

export default Bless;
