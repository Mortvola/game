import { gpu } from "./Main";
import {
  makeShaderDataDefinitions,
  makeStructuredView,
} from 'webgpu-utils';
import { lights } from "./shaders/lights";

type BindGroup = {
  bindGroup: GPUBindGroup,
  buffer: GPUBuffer[],
}

const defs = makeShaderDataDefinitions(lights);
export const lightsStructure = makeStructuredView(defs.structs.Lights);

class BindGroups {
  camera: BindGroup | null = null;

  bindGroupLayout0: GPUBindGroupLayout;

  bindGroupLayout1: GPUBindGroupLayout;

  bindGroupLayout2: GPUBindGroupLayout;

  bindGroupLayout3: GPUBindGroupLayout;

  constructor() {
    if (!gpu) {
      throw new Error('gpu not set')
    }

    this.bindGroupLayout0 = gpu.device.createBindGroupLayout({
      label: 'group0',
      entries: [
        { // Projection matrix
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
        { // View matrix
          binding: 1,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
        { // Camera position
          binding: 2,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
        { // Camera position
          binding: 3,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
        { // Light data
          binding: 4,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {
            type: "read-only-storage",
          },
        },
      ]
    })
  
    this.bindGroupLayout1 = gpu.device.createBindGroupLayout({
      label: 'group1',
      entries: [
        { // Model matrix
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
        { // Color
          binding: 1,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
      ]
    });
      
    this.bindGroupLayout2 = gpu.device.createBindGroupLayout({
      label: 'group2',
      entries: [
        { // Circle data, reticle radius
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
      ]
    });

    this.bindGroupLayout3 = gpu.device.createBindGroupLayout({
      label: 'group3',
      entries: [
        { // Sampler
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {},
        },
        { // Texture 2D
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {},
        },
      ]
    })
  
    this.createCameraBindGroups()
  }

  createCameraBindGroups() {
    if (gpu) {
      const matrixBufferSize = 16 * Float32Array.BYTES_PER_ELEMENT;

      const projectionTransformBuffer = gpu.device.createBuffer({
        label: 'projection Matrix',
        size: matrixBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      const viewTransformBuffer = gpu.device.createBuffer({
        label: 'view Matrix',
        size: matrixBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      const cameraPosBuffer = gpu.device.createBuffer({
        label: 'camera position',
        size: 4 * Float32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      const aspectRatioBuffer = gpu.device.createBuffer({
        label: 'aspect ratio',
        size: 1 * Float32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      const lightsBuffer = gpu.device.createBuffer({
        label: 'lights',
        size: lightsStructure.arrayBuffer.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      });

      const cameraBindGroup = gpu.device.createBindGroup({
        label: 'camera',
        layout: this.bindGroupLayout0,
        entries: [
          { binding: 0, resource: { buffer: projectionTransformBuffer }},
          { binding: 1, resource: { buffer: viewTransformBuffer }},
          { binding: 2, resource: { buffer: cameraPosBuffer }},
          { binding: 3, resource: { buffer: aspectRatioBuffer }},
          { binding: 4, resource: { buffer: lightsBuffer }},
        ],
      });

      this.camera = {
        bindGroup: cameraBindGroup,
        buffer: [
            projectionTransformBuffer,
            viewTransformBuffer,
            cameraPosBuffer,
            aspectRatioBuffer,
            lightsBuffer,
        ],
      }
    }
  }
}

export default BindGroups;