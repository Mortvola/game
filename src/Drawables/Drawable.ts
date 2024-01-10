import { Mat4, vec4, Vec4 } from 'wgpu-matrix';
import DrawableInterface, { maxInstances } from "./DrawableInterface";

class Drawable implements DrawableInterface {
  drawable = true;

  uuid = '';

  name = '';

  tag = '';

  modelMatrices: Float32Array = new Float32Array(16 * maxInstances);

  numInstances = 0;

  render(passEncoder: GPURenderPassEncoder): void {
    throw new Error('render not implemented')
  }

  setColor(color: Vec4) {
    throw new Error('not implemented');
  }

  getColor(): Float32Array {
    throw new Error('not implemented');
  }

  hitTest(origin: Vec4, vector: Vec4): { point: Vec4, t: number, drawable: DrawableInterface} | null {
    return null;
  }

  computeCentroid(): Vec4 {
    return vec4.create();
  }

  resetTransforms() {
    this.numInstances = 0;
  }

  addInstanceTransform(transform: Mat4) {
    transform.forEach((float, index) => {
      this.modelMatrices[this.numInstances * 16 + index] = float;
    })

    this.numInstances += 1;
  }
}

export default Drawable;
