import { Vec4 } from "wgpu-matrix";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Action, { TimeType } from "../Action";
import Actor from "../../Actor";

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

  prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
  }

  interact(script: Script, world: WorldInterface): boolean {
    return true;
  }
}

export default Spell;
