import { bindGroups, gpu } from "../Main";
import PipelineInterface from "./PipelineInterface";
import { lineShader } from '../shaders/line';
import { DrawableNodeInterface } from "../Drawables/DrawableNodeInterface";

class LinePipeline implements PipelineInterface {
  pipeline: GPURenderPipeline;

  constructor() {
    if (!gpu) {
      throw new Error('device is not set')
    }

    const shaderModule = gpu.device.createShaderModule({
      label: 'line',
      code: lineShader,
    })

    const pipelineLayout = gpu.device.createPipelineLayout({
      label: 'line',
      bindGroupLayouts: [
        bindGroups.bindGroupLayout0,
      ],
    });

    const vertexBufferLayout: GPUVertexBufferLayout[] = [
      {
        attributes: [
          {
            shaderLocation: 0, // position
            offset: 0,
            format: "float32x4" as GPUVertexFormat,
          },
          {
            shaderLocation: 1, // color
            offset: 16,
            format: "float32x4" as GPUVertexFormat,
          },
        ],
        arrayStride: 32,
        stepMode: "vertex",
      },
    ];    
    
    const pipelineDescriptor: GPURenderPipelineDescriptor = {
      label: 'line',
      vertex: {
        module: shaderModule,
        entryPoint: "vertex_line",
        buffers: vertexBufferLayout,
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fragment_line",
        targets: [
          {
            format: navigator.gpu.getPreferredCanvasFormat(),
          },
        ],
      },
      primitive: {
        topology: "line-list",
        cullMode: "none",
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

  render(passEncoder: GPURenderPassEncoder, drawables: DrawableNodeInterface[]) {
    passEncoder.setPipeline(this.pipeline);

    for (const drawableNode of drawables) {
      drawableNode.drawable.render(passEncoder);
    }
  }
}

export default LinePipeline;
