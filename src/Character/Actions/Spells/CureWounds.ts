import { Vec4 } from "wgpu-matrix";
import Actor from "../../Actor";
import Spell from "./Spell";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";
import { abilityModifier, diceRoll } from "../../../Dice";

class CureWounds extends Spell {
  constructor() {
    super('Cure Wounds', 'Action', 1);
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    this.prepareZeroDistAction(100, actor, target, point, world);
  }

  interact(actor: Actor, script: Script, world: WorldInterface): void {
    this.zeroDistanceAction(actor, script, world, () => {
      this.target?.takeHealing(diceRoll(1, 8) + abilityModifier(actor.character.abilityScores.wisdom), actor, this.name, script)

      if (actor.character.actionsLeft > 0) {
        actor.character.actionsLeft -= 1;
      }    
    });
  }
}

export default CureWounds;
