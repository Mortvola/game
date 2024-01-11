import { Mat4, Quat, Vec3 } from "wgpu-matrix";
import { AllowedTransformations } from "./SceneNode";

export interface SceneNodeInterface {
  uuid: string;

  name: string;

  translate: Vec3;

  qRotate: Quat;

  angles: number[];

  scale: Vec3;

  allowedTransformations: AllowedTransformations;

  computeTransform(transform: Mat4, prepend?: boolean): Mat4;
}