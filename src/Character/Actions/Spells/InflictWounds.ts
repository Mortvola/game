import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";
import { diceRoll, spellAttackRoll } from "../../../Dice";
import TouchSpell from "./TouchSpell";
import { DamageType } from "../../Equipment/Weapon";

class InflictWounds extends TouchSpell {
  constructor(actor: Actor) {
    super(actor, 'Inflict Wounds', 'Action', 1, 0, 0, false)
  }

  cast(script: Script, world: WorldInterface) {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.target!.character,
      () => diceRoll(3, 10),
      DamageType.Necrotic,
      'Neutral'
    )

    this.target!.takeDamage(damage, critical, this.actor, this.name, script);
  }
}

export default InflictWounds;
