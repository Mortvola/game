import { savingThrow } from "../../../Dice";
import Script from "../../../Script/Script";
import { CreatureActorInterface } from '../../../types'
import { feetToMeters } from "../../../Renderer/Math";
import RangeSpell from "./RangeSpell";

class CharmPerson extends RangeSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Charm Person', 'Action', 1, feetToMeters(30), 60 * 60, false, false);
  }

  async cast(script: Script): Promise<boolean> {
    const st = savingThrow(this.targets[0].character, this.targets[0].character.abilityScores.wisdom, 'Advantage');

    if (st < this.actor.character.spellCastingDc) {
      this.targets[0].character.addInfluencingAction(this)

      if (this.world.loggerCallback) {
        this.world.loggerCallback(`${this.actor.character.name} charmed ${this.targets[0].character.name}.`)
      }

      return true;
    }

    if (this.world.loggerCallback) {
      this.world.loggerCallback(`${this.actor.character.name} failed to charm ${this.targets[0].character.name}.`)
    }

    return false;
  }
}

export default CharmPerson;
