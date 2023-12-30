import { Vec4 } from "wgpu-matrix";
import Script from "../../Script/Script";
import { WorldInterface } from "../../WorldInterface";
import Actor from "../Actor";

export interface Action {
  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void;

  interact(actor: Actor, script: Script, world: WorldInterface): void;
}
