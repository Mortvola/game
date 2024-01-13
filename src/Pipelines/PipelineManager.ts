// import BillboardPipeline from "./BillboardPipeline";
import BindGroups from "../BindGroups";
import Gpu from "../Gpu";
import { litShader } from "../shaders/lit";
import { PipelineAttributes, PipelineInterface, PipelineManagerInterface } from "../types";
import CirclePipeline from "./CirclePipeline";
// import DragHandlesPipeline from "./DragHandlesPipeline";
import LinePipeline from "./LinePipeline";
import LitPipeline from "./LitPipeline";
import OutlinePipeline from "./OutlinePipeline";
import Pipeline from "./Pipeline";
// import Pipeline from "./Pipeline";
import ReticlePipeline from "./ReticlePipeline";
import TrajectoryPipeline from "./TrajectoryPipeline";

export type PipelineType =
  'Lit' | 'pipeline' | 'Line' | 'billboard' | 'drag-handles' | 'Circle' | 'outline' | 'reticle' |
  'Trajectory';

type Pipelines = {
  type: PipelineType,
  pipeline: PipelineInterface,
}

class PipelineManager implements PipelineManagerInterface {
  // private static instance: PipelineManager | null = null;

  gpu: Gpu;

  bindGroups: BindGroups;

  pipelines: Pipelines[] = [];

  pipelineMap: Map<string, Pipeline> = new Map();

  constructor(gpu: Gpu | null, bindGroups: BindGroups) {
    if (!gpu) {
      throw new Error('gpu not set')
    }

    this.gpu = gpu;
    this.bindGroups = bindGroups;

    this.pipelines = [];

    this.pipelines.push({ type: 'Lit', pipeline: new LitPipeline() });
    // this.pipelines.push({ type: 'pipeline', pipeline: new Pipeline() })
    this.pipelines.push({ type: 'Line', pipeline: new LinePipeline() });
    // this.pipelines.push({ type: 'billboard', pipeline: new BillboardPipeline() });
    // this.pipelines.push({ type: 'drag-handles', pipeline: new DragHandlesPipeline() });
    this.pipelines.push({ type: 'Circle', pipeline: new CirclePipeline() });
    this.pipelines.push({ type: 'outline', pipeline: new OutlinePipeline() });
    this.pipelines.push({ type: 'reticle', pipeline: new ReticlePipeline() });
    this.pipelines.push({ type: 'Trajectory', pipeline: new TrajectoryPipeline() });
  }

  // public static getInstance(): PipelineManager {
  //   if (PipelineManager.instance === null) {
  //     PipelineManager.instance = new PipelineManager();
  //   }

  //   return this.instance!
  // }

  getPipeline(type: PipelineType): PipelineInterface | null {
    const entry = this.pipelines.find((pipeline) => pipeline.type === type);

    if (entry) {
      return entry.pipeline;
    }

    console.log(`pipeline ${type} not found.`)

    return null;
  }

  getPipelineByArgs(args: PipelineAttributes): Pipeline {
    const key = JSON.stringify(args);

    let pipeline = this.pipelineMap.get(key);

    if (pipeline) {
      return pipeline;
    }

    if (!this.gpu) {
      throw new Error('device is not set')
    }

    const shaderModule = this.gpu.device.createShaderModule({
      label: 'base pipeline',
      code: litShader,
    })
    
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
      label: 'base pipeline',
      vertex: {
        module: shaderModule,
        entryPoint: "vertex_simple",
        buffers: vertexBufferLayout,
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fragment_simple",
        targets: [
          {
            format: navigator.gpu.getPreferredCanvasFormat(),
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "back",
        frontFace: "ccw",
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus"
      },
      layout: this.gpu.device.createPipelineLayout({
        bindGroupLayouts: [
          this.bindGroups.bindGroupLayout0,
          this.bindGroups.bindGroupLayout1,
          this.bindGroups.bindGroupLayout2A,
        ],
      }),
    };
    
    const gpuPipeline = this.gpu.device.createRenderPipeline(pipelineDescriptor);

    pipeline = new Pipeline();
    pipeline.pipeline = gpuPipeline;

    this.pipelineMap.set(key, pipeline);

    console.log(`pipelines created: ${this.pipelineMap.size}`)
    return pipeline;
  }
}

export default PipelineManager;
