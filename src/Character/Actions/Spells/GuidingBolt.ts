import { Vec4 } from "wgpu-matrix";
import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from "../../../WorldInterface";
import { diceRoll, spellAttackRoll } from "../../../Dice";
import Script from "../../../Script/Script";

class GuidingBolt extends Spell {
  constructor() {
    super('Guiding Bolt', 'Action', 1, feetToMeters(120), 6, false)
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    this.target = target;

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
      const [damage, critical] = spellAttackRoll(
        actor.character,
        this.target.character,
        actor.character.abilityScores.wisdom,
        () => diceRoll(4, 6),
        'Neutral'
      )

      this.target.takeDamage(damage, critical, actor, this.name, script);

      if (this.level >= 1 && actor.character.spellSlots[this.level - 1] > 0) {
        actor.character.spellSlots[this.level - 1] -= 1;
      }

      return true;
    }

    return false;
  }
}

export default GuidingBolt;
