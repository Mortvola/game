import { Vec4 } from "wgpu-matrix";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";
import SanctuaryCondition from '../Conditions/Sanctuary'
import Logger from "../../../Script/Logger";
import { feetToMeters } from "../../../Math";

class Sanctuary extends Spell {
  constructor() {
    super('Sanctuary', 'Bonus', 1, feetToMeters(30), 60, false);
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    let success = 0;

    if (target && !target.character.hasCondition('Sanctuary')) {
      this.target = target;
      success = 100;
    }

    if (world.actionInfoCallback) {
      world.actionInfoCallback({
        action: this.name,
        description: `Select 1 target.`,
        percentSuccess: success,
      })
    }              
  }

  interact(actor: Actor, script: Script, world: WorldInterface): boolean {
    if (this.target) {
      this.target.character.conditions.push(new SanctuaryCondition())
      script.entries.push(new Logger(`${actor.character.name} gained sanctuary.`))

      if (world.actionInfoCallback) {
        world.actionInfoCallback(null);
      }

      if (this.level >= 1 && actor.character.spellSlots[this.level - 1] > 0) {
        actor.character.spellSlots[this.level - 1] -= 1;
      }

      return true;
    }

    return false;
  }
}

export default Sanctuary;
