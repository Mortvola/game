import { Vec4 } from "wgpu-matrix";
import Script from "../Script/Script";
import { WorldInterface } from "../WorldInterface";

export interface Action {
  prepareInteraction(point: Vec4, world: WorldInterface): void;

  interact(script: Script, world: WorldInterface): void;
}
