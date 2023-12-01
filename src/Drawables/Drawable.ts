import { vec4, Vec4 } from 'wgpu-matrix';
import DrawableInterface from "./DrawableInterface";
import SceneNode from './SceneNode';

class Drawable extends SceneNode implements DrawableInterface {
  drawable = true;

  tag = '';

  render(passEncoder: GPURenderPassEncoder): void {
    throw new Error('render not implemented')
  }

  setColor(color: Vec4) {
    throw new Error('not implemented');
  }

  getColor(): Float32Array {
    throw new Error('not implemented');
  }

  hitTest(origin: Vec4, vector: Vec4): { point: Vec4, t: number, drawable: Drawable} | null {
    return null;
  }

  computeCentroid(): Vec4 {
    return vec4.create();
  }
}

export default Drawable;
