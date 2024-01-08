import { Vec4 } from "wgpu-matrix";
import { WorldInterface } from "./WorldInterface";

export type ActorOnFinishCallback = (timestamp: number) => void;

export interface ActorInterface {
  update(elapsedTime: number, timestamp: number, world: WorldInterface): Promise<boolean>;
}

export interface CreatureActorInterface extends ActorInterface {
  getWorldPosition(): Vec4;
}
