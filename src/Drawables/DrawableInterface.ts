import { Vec4, Mat4 } from 'wgpu-matrix';

export const maxInstances = 16;

interface DrawableInterface {
  drawable: boolean;

  uuid: string;

  name: string;

  render(passEncoder: GPURenderPassEncoder): void;

  tag: string;

  modelMatrices: Float32Array;

  numInstances: number;

  setColor(color: Vec4): void;

  getColor(): Float32Array;

  hitTest(origin: Vec4, vector: Vec4): { point: Vec4, t: number, drawable: DrawableInterface} | null;

  computeCentroid(): Vec4;

  resetTransforms(): void;

  addInstanceTransform(mat4: Mat4): void;
}

export const isDrawableInterface = (r: unknown): r is DrawableInterface => (
  (r as DrawableInterface).drawable !== undefined
  && (r as DrawableInterface).modelMatrices !== undefined
)

export default DrawableInterface;
