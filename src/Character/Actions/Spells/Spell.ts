import { Vec4 } from "wgpu-matrix";
import Script from "../../../Script/Script";
import { CreatureActorInterface, WorldInterface } from '../../../types'
import Action, { TimeType } from "../Action";
import { getWorld } from "../../../Main";

class Spell extends Action {
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

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    return false;
  }

  async castSpell(script: Script): Promise<boolean> {
    const world = getWorld();

    // End concentration of the curren spell if this spell 
    // requires concentration.
    if (this.concentration) {
      this.actor.character.stopConcentrating();
    }

    if (await this.cast(script, world) && this.duration > 0) {
      this.actor.character.enduringActions.push(this);
    }

    if (world.actionInfoCallback) {
      world.actionInfoCallback(null);
    }

    if (this.level >= 1 && this.actor.character.spellSlots[this.level - 1] > 0) {
      this.actor.character.spellSlots[this.level - 1] -= 1;
    }

    return true;
  }

  async prepareInteraction(target: CreatureActorInterface | null, point: Vec4 | null, world: WorldInterface): Promise<void> {
  }

  async interact(script: Script, world: WorldInterface): Promise<boolean> {
    return true;
  }
}

export default Spell;
