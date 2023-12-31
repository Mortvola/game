import { diceRoll, spellAttackRoll } from "../../../Dice";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import { DamageType } from "../../Equipment/Weapon";
import TouchSpell from "./TouchSpell";

class ShockingGrasp extends TouchSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Shocking Grasp', 'Action', 0, 0, 0, false, false);
  }

  cast(script: Script, world: WorldInterface) {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.targets[0].character,
      () => diceRoll(1, 8),
      DamageType.Lightning,
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, this.actor, this.name, script);
    
    // TODO: add condition where target cannot take reactions until the start of its next turn

    return damage > 0;
  }
}

export default ShockingGrasp;
