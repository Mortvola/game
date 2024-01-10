import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";
import { diceRoll, spellAttackRoll } from "../../../Dice";
import TouchSpell from "./TouchSpell";
import { DamageType } from "../../Equipment/Weapon";

class InflictWounds extends TouchSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Inflict Wounds', 'Action', 1, 0, false, false)
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.targets[0].character,
      () => diceRoll(3, 10),
      DamageType.Necrotic,
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, this.actor, this.name, script);

    return damage > 0;
  }
}

export default InflictWounds;
