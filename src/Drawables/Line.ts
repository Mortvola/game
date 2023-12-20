import { Vec4, vec4 } from 'wgpu-matrix';
import Drawable from "./Drawable";
import { gpu } from '../Renderer';

class Line extends Drawable {
  vertices: number[];

  vertexBuffer: GPUBuffer;

  constructor(p1: Vec4[], color = vec4.create(1, 0, 0, 1)) {
    super();
  
    this.vertices = p1.flatMap((p) => (
      [p[0], p[1], p[2], p[3], color[0], color[1], color[2], color[3]]
    ))

    this.vertexBuffer = gpu!.device.createBuffer({
      size: this.vertices.length * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });  
    {
      const mapping = new Float32Array(this.vertexBuffer.getMappedRange());
      mapping.set(this.vertices, 0);
      this.vertexBuffer.unmap();  
    }
  }

  render(passEncoder: GPURenderPassEncoder) {
    passEncoder.setVertexBuffer(0, this.vertexBuffer);
    passEncoder.draw(this.vertices.length / 8);  
  }
}

export default Line;
