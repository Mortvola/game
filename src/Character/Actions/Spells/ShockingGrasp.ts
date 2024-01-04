import { diceRoll, spellAttackRoll } from "../../../Dice";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import { DamageType } from "../../Equipment/Weapon";
import TouchSpell from "./TouchSpell";

class ShockingGrasp extends TouchSpell {
  constructor(actor: Actor) {
    super(actor, 'Shocking Grasp', 'Action', 0, 0, 0, false);
  }

  cast(script: Script, world: WorldInterface) {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.target!.character,
      () => diceRoll(1, 8),
      DamageType.Lightning,
      'Neutral'
    )

    this.target!.takeDamage(damage, critical, this.actor, this.name, script);
    
    // TODO: add condition where target cannot take reactions until the start of its next turn
  }
}

export default ShockingGrasp;
