import { Vec4 } from "wgpu-matrix";
import Script from "../../../Script/Script";
import { CreatureActorInterface, SpellInterface, TimeType } from '../../../types'
import Action from "../Action";

class Spell extends Action implements SpellInterface {
  level: number;

  castingTime = 1;

  concentration: boolean;

  uniqueTargets: boolean;

  constructor(
    actor: CreatureActorInterface,
    maxTargets: number,
    uniqueTargets: boolean,
    name: string,
    time: TimeType,
    level: number,
    duration: number,
    endOfTurn: boolean,
    concentration: boolean,
  ) {
    super(actor, maxTargets, name, time, duration, endOfTurn);

    this.uniqueTargets = uniqueTargets;
    this.level = level;
    this.concentration = concentration;
  }

  initialize() {
  }

  clear() {
  }

  async cast(script: Script): Promise<boolean> {
    return false;
  }

  async castSpell(script: Script): Promise<boolean> {
    // End concentration of the curren spell if this spell 
    // requires concentration.
    if (this.concentration) {
      this.actor.character.stopConcentrating();
    }

    if (await this.cast(script) && this.duration > 0) {
      this.actor.character.enduringActions.push(this);
    }

    if (this.world.actionInfoCallback) {
      this.world.actionInfoCallback(null);
    }

    if (this.level >= 1 && this.actor.character.spellSlots[this.level - 1] > 0) {
      this.actor.character.spellSlots[this.level - 1] -= 1;
    }

    return true;
  }

  async prepareInteraction(target: CreatureActorInterface | null, point: Vec4 | null): Promise<void> {
  }

  async interact(script: Script): Promise<boolean> {
    return true;
  }
}

export default Spell;
