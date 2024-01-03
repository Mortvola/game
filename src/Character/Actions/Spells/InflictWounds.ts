import { Vec4 } from "wgpu-matrix";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";
import { diceRoll, spellAttackRoll } from "../../../Dice";

class InflictWounds extends Spell {
  constructor() {
    super('Inflict Wounds', 'Action', 1, 0, 0, false)
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    this.prepareZeroDistAction(100, actor, target, point, world);
  }

  interact(actor: Actor, script: Script, world: WorldInterface): boolean {
    return this.zeroDistanceAction(actor, script, world, () => {
      const [damage, critical] = spellAttackRoll(
        actor.character,
        this.target!.character,
        actor.character.abilityScores.wisdom,
        () => diceRoll(3, 10),
        'Neutral'
      )

      this.target!.takeDamage(damage, critical, actor, this.name, script);

      if (this.level >= 1 && actor.character.spellSlots[this.level - 1] > 0) {
        actor.character.spellSlots[this.level - 1] -= 1;
      }
    });
  }
}

export default InflictWounds;
