import { bindGroups, gpu } from "../Main";
import PipelineInterface from "./PipelineInterface";
import { trajectoryShader } from '../shaders/trajectory';
import { DrawableNodeInterface } from "../Drawables/SceneNodes/DrawableNodeInterface";

const label = 'trajectory'
class TrajectoryPipeline implements PipelineInterface {
  pipeline: GPURenderPipeline;

  constructor() {
    if (!gpu) {
      throw new Error('device is not set')
    }

    const shaderModule = gpu.device.createShaderModule({
      label,
      code: trajectoryShader,
    })

    const pipelineDescriptor: GPURenderPipelineDescriptor = {
      label,
      vertex: {
        module: shaderModule,
        entryPoint: "vs",
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
        topology: "line-list",
        cullMode: "none",
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
        ],
      }),
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

export default TrajectoryPipeline;
