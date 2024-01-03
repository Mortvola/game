import { abilityModifier, getProficiencyBonus, savingThrow } from "../../../Dice";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import Charmed from "../Conditions/Charmed";
import { feetToMeters } from "../../../Math";
import RangeSpell from "./RangeSpell";

class CharmPerson extends RangeSpell {
  constructor() {
    super(1, true, 'Charm Person', 'Action', 1, feetToMeters(30), 60 * 60, false);
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    const st = savingThrow(this.targets[0].character, this.targets[0].character.abilityScores.wisdom, 'Advantage');
    const dc = 8 + getProficiencyBonus(actor.character.charClass.level) + abilityModifier(actor.character.abilityScores.wisdom);

    if (st < dc) {
      this.targets[0].character.conditions.push(new Charmed(actor.character))
      
      if (world.loggerCallback) {
        world.loggerCallback(`${actor.character.name} charmed ${this.targets[0].character.name}.`)
      }
    }
    else if (world.loggerCallback) {
      world.loggerCallback(`${actor.character.name} failed to charm ${this.targets[0].character.name}.`)
    }
  }
}

export default CharmPerson;
