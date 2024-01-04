import { diceRoll, spellAttackRoll } from "../../../Dice";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import { DamageType } from "../../Equipment/Weapon";
import TouchSpell from "./TouchSpell";

class ShockingGrasp extends TouchSpell {
  constructor() {
    super('Shocking Grasp', 'Action', 0, 0, 0, false);
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    const [damage, critical] = spellAttackRoll(
      actor.character,
      this.target!.character,
      () => diceRoll(1, 8),
      DamageType.Lightning,
      'Neutral'
    )

    this.target!.takeDamage(damage, critical, actor, this.name, script);
    
    // TODO: add condition where target cannot take reactions until the start of its next turn
  }
}

export default ShockingGrasp;
