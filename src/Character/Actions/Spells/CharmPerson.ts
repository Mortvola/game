import { savingThrow } from "../../../Dice";
import Script from "../../../Script/Script";
import { WorldInterface } from '../../../types'
import Actor from "../../Actor";
import { feetToMeters } from "../../../Math";
import RangeSpell from "./RangeSpell";

class CharmPerson extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Charm Person', 'Action', 1, feetToMeters(30), 60 * 60, false, false);
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    const st = savingThrow(this.targets[0].character, this.targets[0].character.abilityScores.wisdom, 'Advantage');

    if (st < this.actor.character.spellCastingDc) {
      this.targets[0].character.addInfluencingAction(this)

      if (world.loggerCallback) {
        world.loggerCallback(`${this.actor.character.name} charmed ${this.targets[0].character.name}.`)
      }

      return true;
    }

    if (world.loggerCallback) {
      world.loggerCallback(`${this.actor.character.name} failed to charm ${this.targets[0].character.name}.`)
    }

    return false;
  }
}

export default CharmPerson;
