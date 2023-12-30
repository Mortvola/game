import { Vec4 } from "wgpu-matrix";
import { feetToMeters } from "../../Math";
import Script from "../../Script/Script";
import { WorldInterface } from "../../WorldInterface";
import { Action } from "../Action";

class Spell implements Action {
  name: string;

  castingTime = 1;

  range = feetToMeters(60);

  duration = 60;

  constructor(name: string) {
    this.name = name;
  }

  prepareInteraction(point: Vec4, world: WorldInterface): void {
  }

  interact(script: Script, world: WorldInterface) {
  }
}

export default Spell;
