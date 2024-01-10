import { Vec4 } from "wgpu-matrix";
import DrawableInterface from "./DrawableInterface";
import { SceneNodeInterface } from "./SceneNodeInterface";
import { PipelineType } from "../Pipelines/PipelineManager";

export interface DrawableNodeInterface extends SceneNodeInterface {
  drawable: DrawableInterface;

  pipelineType: PipelineType;
  
  hitTest(origin: Vec4, vector: Vec4): { point: Vec4, t: number, drawable: DrawableInterface} | null;
}

export const isDrawableNode = (r: unknown): r is DrawableNodeInterface => (
  (r as DrawableNodeInterface).drawable !== undefined
)
