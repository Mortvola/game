import { bindGroups } from '../BindGroups';
import { gpu } from '../Gpu';
import { trajectoryShader } from '../shaders/trajectory';
import Pipeline from "./Pipeline";

const label = 'trajectory'
class TrajectoryPipeline extends Pipeline {
  constructor() {
    super();

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
          bindGroups.getBindGroupLayout0(gpu.device),
          bindGroups.getBindGroupLayout1(gpu.device),
          bindGroups.getBindGroupLayout2(gpu.device),
          bindGroups.getBindGroupLayout3(gpu.device),
        ],
      }),
    };
    
    this.pipeline = gpu.device.createRenderPipeline(pipelineDescriptor);
  }
}

export default TrajectoryPipeline;
