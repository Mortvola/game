import { Vec4 } from "wgpu-matrix";
import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Action from "../Action";
import Actor from "../../Actor";

class Spell extends Action {
  castingTime = 1;

  range = feetToMeters(60);

  duration = 60;

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
  }

  interact(actor: Actor, script: Script, world: WorldInterface) {
  }
}

export default Spell;
