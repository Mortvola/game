import { Vec4 } from "wgpu-matrix";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Action, { TimeType } from "../Action";
import Actor from "../../Actor";

class Spell extends Action {
  level: number;

  castingTime = 1;

  range = feetToMeters(60);

  duration = 60;

  constructor(name: string, time: TimeType, level: number) {
    super(name, time);

    this.level = level;
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
  }

  interact(actor: Actor, script: Script, world: WorldInterface): boolean {
    return true;
  }
}

export default Spell;
