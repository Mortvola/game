import { diceRoll, spellAttackRoll } from "../../../Dice";
import { feetToMeters } from "../../../Renderer/Math";
import Script from "../../../Script/Script";
import { CreatureActorInterface, WorldInterface } from '../../../types'
import { DamageType } from "../../Equipment/Types";
import RangeSpell from "./RangeSpell";

class ChromaticOrb extends RangeSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Chromatic Orb', 'Action', 1, feetToMeters(90), 0, false, false)
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.targets[0].character,
      () => diceRoll(3, 8),
      DamageType.Fire, // TODO: make this selectable.
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, this.actor, this.name, script);

    return damage > 0;
  }
}

export default ChromaticOrb;
