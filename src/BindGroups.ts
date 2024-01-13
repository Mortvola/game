import {
  makeShaderDataDefinitions,
  makeStructuredView,
} from 'webgpu-utils';
import { lights } from "./shaders/lights";
import Gpu from "./Gpu";

const defs = makeShaderDataDefinitions(lights);
export const lightsStructure = makeStructuredView(defs.structs.Lights);

class BindGroups {
  gpu: Gpu;

  bindGroupLayout0: GPUBindGroupLayout;

  bindGroupLayout1: GPUBindGroupLayout;

  bindGroupLayout2: GPUBindGroupLayout;

  bindGroupLayout2A: GPUBindGroupLayout;

  bindGroupLayout3: GPUBindGroupLayout;

  constructor(gpu: Gpu | null) {
    if (!gpu) {
      throw new Error('gpu not set')
    }

    this.gpu = gpu;

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
      ]
    });

    this.bindGroupLayout2 = gpu.device.createBindGroupLayout({
      label: 'group2',
      entries: [
        { // Color
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
        { // Sampler
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {},
        },
        { // Texture 2D
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {},
        },
      ]
    });

    this.bindGroupLayout2A = gpu.device.createBindGroupLayout({
      label: 'group2',
      entries: [
        { // Color
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
      ]
    });
      
    this.bindGroupLayout3 = gpu.device.createBindGroupLayout({
      label: 'group3',
      entries: [
        { // Circle data, reticle radius
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
      ]
    });
  }
}

export default BindGroups;