import { Vec4 } from "wgpu-matrix";
import { abilityModifier, abilityRoll, diceRoll, getProficiencyBonus, savingThrow } from "../../../Dice";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import Spell from "./Spell";
import Charmed from "../Conditions/Charmed";

class CharmPerson extends Spell {
  constructor() {
    super('Charm Person', 'Action', 1);
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

  interact(actor: Actor, script: Script, world: WorldInterface): boolean {
    if (this.target) {
      const st = savingThrow(this.target.character.abilityScores.wisdom, 'Advantage');
      const dc = 8 + getProficiencyBonus(actor.character.charClass.level) + abilityModifier(actor.character.abilityScores.wisdom);

      if (st < dc) {
        this.target.character.conditions.push(new Charmed(actor.character))
        
        if (world.loggerCallback) {
          world.loggerCallback(`${actor.character.name} charmed ${this.target.character.name}.`)
        }
      }
      else if (world.loggerCallback) {
        world.loggerCallback(`${actor.character.name} failed to charm ${this.target.character.name}.`)
      }

      return true;
    }

    return false;
  }
}

export default CharmPerson;
