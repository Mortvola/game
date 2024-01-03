import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";
import { abilityModifier, diceRoll } from "../../../Dice";
import TouchSpell from "./TouchSpell";

class CureWounds extends TouchSpell {
  constructor() {
    super('Cure Wounds', 'Action', 1, 0, 0, false);
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    this.target?.takeHealing(diceRoll(1, 8) + abilityModifier(actor.character.abilityScores.wisdom), actor, this.name, script)
  }
}

export default CureWounds;
