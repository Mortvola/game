import { gpu, bindGroups } from "../Main";
import { outlineShader } from '../shaders/outline';
import Pipeline from "./Pipeline";

const label = 'outline';

class OutlinePipeline extends Pipeline {
  constructor() {
    super();

    if (!gpu) {
      throw new Error('device is not set')
    }

    const shaderModule = gpu.device.createShaderModule({
      label,
      code: outlineShader,
    })

    const pipelineLayout = gpu.device.createPipelineLayout({
      bindGroupLayouts: [
        bindGroups.bindGroupLayout0,
        bindGroups.bindGroupLayout1,
        bindGroups.bindGroupLayout2,
      ],
    });
    
    const vertexBufferLayout: GPUVertexBufferLayout[] = [
      {
        attributes: [
          {
            shaderLocation: 0, // position
            offset: 0,
            format: "float32x4",
          },
        ],
        arrayStride: 16,
        stepMode: "vertex",
      },
      {
        attributes: [
          {
            shaderLocation: 1, // normal
            offset: 0,
            format: "float32x4",
          }
        ],
        arrayStride: 16,
        stepMode: "vertex",
      }
    ];
    
    const pipelineDescriptor: GPURenderPipelineDescriptor = {
      label,
      vertex: {
        module: shaderModule,
        entryPoint: "vs",
        buffers: vertexBufferLayout,
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fs",
        targets: [
          {
            format: navigator.gpu.getPreferredCanvasFormat(),
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "front",
        frontFace: "ccw",
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus"
      },
      layout: pipelineLayout,
    };
    
    this.pipeline = gpu.device.createRenderPipeline(pipelineDescriptor);
  }
}

export default OutlinePipeline;
