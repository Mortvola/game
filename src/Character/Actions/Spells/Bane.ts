import { feetToMeters } from "../../../Math";
import { savingThrow } from "../../../Dice";
import RangeSpell from "./RangeSpell";
import Script from "../../../Script/Script";
import { CreatureActorInterface, WorldInterface } from "../../../types";

class Bane extends RangeSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 3, true, 'Bane', 'Action', 1, feetToMeters(30), 60, false, true)
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    for (let i = 0; i < this.targets.length; i += 1) {
      const st = savingThrow(this.targets[i].character, this.targets[i].character.abilityScores.charisma, 'Neutral');

      if (st < this.actor.character.spellCastingDc) {
        this.targets[i].character.addInfluencingAction(this)
        
        if (world.loggerCallback) {
          world.loggerCallback(`${this.actor.character.name} cast bane on ${this.targets[i].character.name}.`)
        }
      }
      else if (world.loggerCallback) {
        world.loggerCallback(`${this.actor.character.name} failed to cast bane on ${this.targets[i].character.name}.`)

        this.targets = [
          ...this.targets.slice(0, i),
          ...this.targets.slice(i + 1),
        ]

        i -= 1;
      }    
    }

    if (this.targets.length > 0) {          
      this.actor.character.concentration = this;

      return true;
    }

    return false;
  }
}

export default Bane;
