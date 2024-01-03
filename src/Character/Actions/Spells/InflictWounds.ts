import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import Script from "../../../Script/Script";
import { diceRoll, spellAttackRoll } from "../../../Dice";
import TouchSpell from "./TouchSpell";

class InflictWounds extends TouchSpell {
  constructor() {
    super('Inflict Wounds', 'Action', 1, 0, 0, false)
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    const [damage, critical] = spellAttackRoll(
      actor.character,
      this.target!.character,
      actor.character.abilityScores.wisdom,
      () => diceRoll(3, 10),
      'Neutral'
    )

    this.target!.takeDamage(damage, critical, actor, this.name, script);
  }
}

export default InflictWounds;
