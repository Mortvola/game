import { gpu, bindGroups } from "../Renderer";
import PipelineInterface from "./PipelineInterface";
import { circleShader } from '../shaders/circle';
import DrawableInterface from "../Drawables/DrawableInterface";

const label = 'CirclePipeline';

class CirclePipeline implements PipelineInterface {
  pipeline: GPURenderPipeline;

  constructor() {
    if (!gpu) {
      throw new Error('device is not set')
    }

    const shaderModule = gpu.device.createShaderModule({
      label,
      code: circleShader,
    })
    
    const pipelineDescriptor: GPURenderPipelineDescriptor = {
      label,
      vertex: {
        module: shaderModule,
        entryPoint: "vertex_circle",
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fragment_circle",
        targets: [
          {
            format: navigator.gpu.getPreferredCanvasFormat(),
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "none",
        frontFace: "ccw",
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus"
      },
      layout: gpu.device.createPipelineLayout({
        label,
        bindGroupLayouts: [
          bindGroups.bindGroupLayout0,
          bindGroups.bindGroupLayout1,
          bindGroups.bindGroupLayout2,
        ]
      }),
    };
    
    this.pipeline = gpu.device.createRenderPipeline(pipelineDescriptor);
  }

  render(passEncoder: GPURenderPassEncoder, drawables: DrawableInterface[]) {
    passEncoder.setPipeline(this.pipeline);

    drawables.forEach((drawable) => {
      drawable.render(passEncoder);
    })
  }
}

export default CirclePipeline;
