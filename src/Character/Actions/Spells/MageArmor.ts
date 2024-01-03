import { Vec4 } from "wgpu-matrix";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import Spell from "./Spell";
import Logger from "../../../Script/Logger";
import MageArmorCondition from "../Conditions/MageArmor";

class MageArmor extends Spell {
  constructor() {
    super('Mage Armor', 'Action', 1, 0, 8 * 60 * 60, false)
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    let actionPercent = 100;
    if (target && target.character.equipped.armor) {
      actionPercent = 0;
    }

    this.prepareZeroDistAction(actionPercent, actor, target, point, world);
  }

  interact(actor: Actor, script: Script, world: WorldInterface): boolean {
    const result = this.zeroDistanceAction(actor, script, world, () => {
      this.target?.character.conditions.push(new MageArmorCondition());

      script.entries.push(new Logger(`${actor.character.name} cast Mage Armor on ${this.target?.character.name}.`))
    });

    if (result) {
      if (this.level >= 1 && actor.character.spellSlots[this.level - 1] > 0) {
        actor.character.spellSlots[this.level- 1] -= 1;
      }
    }

    return result;
  }
}

export default MageArmor;
