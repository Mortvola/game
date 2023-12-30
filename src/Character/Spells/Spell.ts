import { Vec4 } from "wgpu-matrix";
import { feetToMeters } from "../../Math";
import Script from "../../Script/Script";
import { WorldInterface } from "../../WorldInterface";
import { Action } from "../Actions/Action";
import Actor from "../Actor";

class Spell implements Action {
  name: string;

  castingTime = 1;

  range = feetToMeters(60);

  duration = 60;

  constructor(name: string) {
    this.name = name;
  }

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
  }

  interact(actor: Actor, script: Script, world: WorldInterface) {
  }
}

export default Spell;
