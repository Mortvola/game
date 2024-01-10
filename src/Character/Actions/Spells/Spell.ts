import { Vec4 } from "wgpu-matrix";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Action, { TimeType } from "../Action";
import Actor from "../../Actor";
import { getWorld } from "../../../Main";

class Spell extends Action {
  level: number;

  castingTime = 1;

  concentration: boolean;

  uniqueTargets: boolean;

  constructor(
    actor: Actor,
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

  cast(script: Script, world: WorldInterface): boolean {
    return false;
  }

  castSpell(script: Script): boolean {
    const world = getWorld();

    // End concentration of the curren spell if this spell 
    // requires concentration.
    if (this.concentration) {
      this.actor.character.stopConcentrating();
    }

    if (this.cast(script, world) && this.duration > 0) {
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

  async prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): Promise<void> {
  }

  interact(script: Script, world: WorldInterface): boolean {
    return true;
  }
}

export default Spell;
