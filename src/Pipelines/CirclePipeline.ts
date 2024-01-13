import { bindGroups } from '../BindGroups';
import { gpu } from '../Gpu';
import { circleShader } from '../shaders/circle';
import Pipeline from "./Pipeline";

const label = 'CirclePipeline';

class CirclePipeline extends Pipeline {
  constructor() {
    super();

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
          bindGroups.getBindGroupLayout0(gpu.device),
          bindGroups.getBindGroupLayout1(gpu.device),
          bindGroups.getBindGroupLayout2A(gpu.device),
          bindGroups.getBindGroupLayout3(gpu.device),
        ]
      }),
    };
    
    this.pipeline = gpu.device.createRenderPipeline(pipelineDescriptor);
  }
}

export default CirclePipeline;
