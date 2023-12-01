import { Vec4, Mat4 } from 'wgpu-matrix';
import Drawable from './Drawable';
import { bindGroups, gpu } from '../Renderer';

class Circle extends Drawable {
  radius: number;

  thickness: number;

  color = new Float32Array(4);

  bindGroup: GPUBindGroup;

  uniformBuffer: GPUBuffer;

  colorBuffer: GPUBuffer;

  bindGroup2: GPUBindGroup;

  uniformBuffer2: GPUBuffer;

  uniformValues = new Float32Array(3);

  constructor(radius: number, thickness: number, color: Vec4) {
    super()

    if (!gpu) {
      throw new Error('device is not set')
    }

    this.radius= radius;
    this.thickness = thickness;

    this.color[0] = color[0];
    this.color[1] = color[1];
    this.color[2] = color[2];
    this.color[3] = color[3];
    
    this.uniformBuffer = gpu.device.createBuffer({
      label: 'Circle',
      size: 16 * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.colorBuffer = gpu.device.createBuffer({
      label: 'color',
      size: 4 * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.bindGroup = gpu.device.createBindGroup({
      label: 'Circle',
      layout: bindGroups.bindGroupLayout1,
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer }},
        { binding: 1, resource: { buffer: this.colorBuffer }},
      ],
    });

    this.uniformBuffer2 = gpu.device.createBuffer({
      label: 'Circle',
      size: 3 * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.bindGroup2 = gpu.device.createBindGroup({
      label: 'Circle',
      layout: bindGroups.bindGroupLayout2,
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer2 }},
      ],
    });
  }

  render(passEncoder: GPURenderPassEncoder) {
    if (!gpu) {
      throw new Error('gpu device not set.')
    }

    const numSegments = 64;

    this.uniformValues.set([this.radius, numSegments, this.thickness], 0);

    gpu.device.queue.writeBuffer(this.uniformBuffer, 0, this.getTransform() as Float32Array);
    gpu.device.queue.writeBuffer(this.colorBuffer, 0, this.color);
    gpu.device.queue.writeBuffer(this.uniformBuffer2, 0, this.uniformValues);

    passEncoder.setBindGroup(1, this.bindGroup);
    passEncoder.setBindGroup(2, this.bindGroup2);

    // TODO: determine how many lines should be rendered based on radius?
    passEncoder.draw(numSegments * 2 * 3);  
  }

  hitTest(p: Vec4, viewTransform: Mat4): { point: Vec4, t: number, drawable: Drawable} | null {
    // Transform point from model space to world space to camera space.
    // let t = mat4.multiply(mat4.inverse(viewTransform), this.getTransform());

    // let point = vec4.create(t[12], t[13], t[14], t[15])

    // const p2 = intersectionPlane(point, vec4.create(0, 0, 1, 0), vec4.create(0, 0, 0, 1), p);
  
    // if (p2) {
    //   const d = vec2.distance(point, p2)

    //   if (d < Math.abs(this.radius[0] * t[14])) {
    //     // Transform point to world space
    //     const wp = vec4.transformMat4(p2, viewTransform);

    //     return { point: wp, t: 1.0, drawable: this };
    //   }
    // }

    return null;
  }
}

export default Circle;
