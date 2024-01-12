import { Vec4 } from 'wgpu-matrix';
import { gpu } from '../Main';
import SurfaceMesh from "./SurfaceMesh";
import Drawable from './Drawable';
import DrawableInterface from './DrawableInterface';

class Mesh extends Drawable {
  mesh: SurfaceMesh;

  color = new Float32Array(4);

  vertexBuffer: GPUBuffer;

  normalBuffer: GPUBuffer;

  indexBuffer: GPUBuffer;

  indexFormat: GPUIndexFormat = "uint16";

  constructor(mesh: SurfaceMesh, vertices: number[], normals: number[], indices: number[]) {
    super()
  
    if (!gpu) {
      throw new Error('device is not set')
    }

    this.mesh = mesh;
    this.setColor(mesh.color);

    this.vertexBuffer = gpu.device.createBuffer({
      size: vertices.length * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });  

    {
      const mapping = new Float32Array(this.vertexBuffer.getMappedRange());
      mapping.set(vertices, 0);
      this.vertexBuffer.unmap();  
    }

    this.normalBuffer = gpu.device.createBuffer({
      size: normals.length * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });  

    {
      const mapping = new Float32Array(this.normalBuffer.getMappedRange());
      mapping.set(normals, 0);
      this.normalBuffer.unmap();  
    }

    if (indices.length > 0xFFFF) {
      this.indexFormat = "uint32";

      this.indexBuffer = gpu.device.createBuffer({
        size: (indices.length * Uint32Array.BYTES_PER_ELEMENT + 3) & ~3, // Make sure it is a multiple of four
        usage: GPUBufferUsage.INDEX,
        mappedAtCreation: true,
      })
  
      {
        const mapping = new Uint32Array(this.indexBuffer.getMappedRange());
        mapping.set(indices, 0);
        this.indexBuffer.unmap();  
      }  
    }
    else {
      this.indexFormat = "uint16";

      this.indexBuffer = gpu.device.createBuffer({
        size: (indices.length * Uint16Array.BYTES_PER_ELEMENT + 3) & ~3, // Make sure it is a multiple of four
        usage: GPUBufferUsage.INDEX,
        mappedAtCreation: true,
      })
  
      {
        const mapping = new Uint16Array(this.indexBuffer.getMappedRange());
        mapping.set(indices, 0);
        this.indexBuffer.unmap();  
      }  
    }
  }

  static async create(mesh: SurfaceMesh): Promise<Mesh> {
    const { vertices, normals, indices } = await mesh.generateBuffers();

    return new Mesh(mesh, vertices, normals, indices);
  }

  setColor(color: Vec4) {
    this.color[0] = color[0];
    this.color[1] = color[1];
    this.color[2] = color[2];
    this.color[3] = color[3];
  }

  getColor(): Float32Array {
    return this.color;
  }

  hitTest(origin: Vec4, vector: Vec4): { point: Vec4, t: number, drawable: DrawableInterface} | null {
    const result = this.mesh.hitTest(origin, vector);

    if (result) {
      return { point: result.point, t: result.t, drawable: this };      
    }

    return null;
  }

  render(passEncoder: GPURenderPassEncoder, numInstances: number) {
    if (!gpu) {
      throw new Error('gpu devcie not set.')
    }

    passEncoder.setBindGroup(2, this.bindGroup2);

    passEncoder.setVertexBuffer(0, this.vertexBuffer);
    passEncoder.setVertexBuffer(1, this.normalBuffer);

    passEncoder.setIndexBuffer(this.indexBuffer, this.indexFormat);
    passEncoder.drawIndexed(this.mesh.indexes.length, numInstances);
  }

  computeCentroid(): Vec4 {
    return this.mesh.computeCentroid()
  }
}

export default Mesh;
