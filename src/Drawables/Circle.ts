import { Vec4, Mat4 } from 'wgpu-matrix';
import Drawable from './Drawable';
import { bindGroups, gpu } from '../Main';
import { circleShader } from '../shaders/circle';
import { makeShaderDataDefinitions, makeStructuredView } from 'webgpu-utils';
import { maxInstances } from './DrawableInterface';

const defs = makeShaderDataDefinitions(circleShader);

class Circle extends Drawable {
  radius: number;

  thickness: number;

  color = new Float32Array(4);

  circleStructure = makeStructuredView(defs.structs.Circle);

  bindGroup: GPUBindGroup;

  modelMatrixBuffer: GPUBuffer;

  colorBuffer: GPUBuffer;

  bindGroup2: GPUBindGroup;

  circleDataBuffer: GPUBuffer;

  circleData = new Float32Array(4);

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
    
    this.modelMatrixBuffer = gpu.device.createBuffer({
      label: 'Circle',
      size: 16 * Float32Array.BYTES_PER_ELEMENT * maxInstances,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.colorBuffer = gpu.device.createBuffer({
      label: 'color',
      size: 4 * Float32Array.BYTES_PER_ELEMENT * maxInstances,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.bindGroup = gpu.device.createBindGroup({
      label: 'Circle',
      layout: bindGroups.bindGroupLayout1,
      entries: [
        { binding: 0, resource: { buffer: this.modelMatrixBuffer }},
        { binding: 1, resource: { buffer: this.colorBuffer }},
      ],
    });

    this.circleDataBuffer = gpu.device.createBuffer({
      label: 'Circle',
      size: this.circleStructure.arrayBuffer.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.bindGroup2 = gpu.device.createBindGroup({
      label: 'Circle',
      layout: bindGroups.bindGroupLayout2,
      entries: [
        { binding: 0, resource: { buffer: this.circleDataBuffer }},
      ],
    });
  }

  render(passEncoder: GPURenderPassEncoder) {
    if (!gpu) {
      throw new Error('gpu device not set.')
    }

    const numSegments = 64;

    this.circleStructure.set({
      radius: this.radius,
      numSegments: numSegments,
      thickness: this.thickness,
      color: this.color,
    });

    // gpu.device.queue.writeBuffer(this.modelMatrixBuffer, 0, this.getTransform() as Float32Array);
    gpu.device.queue.writeBuffer(this.modelMatrixBuffer, 0, this.modelMatrices);
    gpu.device.queue.writeBuffer(this.circleDataBuffer, 0, this.circleStructure.arrayBuffer);

    passEncoder.setBindGroup(1, this.bindGroup);
    passEncoder.setBindGroup(2, this.bindGroup2);

    // TODO: determine how many lines should be rendered based on radius?
    passEncoder.draw(numSegments * 2 * 3);  
  }

  hitTest(p: Vec4, viewTransform: Mat4): { point: Vec4, t: number, drawable: Drawable} | null {
    return null;
  }
}

export default Circle;
