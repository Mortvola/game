// import BillboardPipeline from "./BillboardPipeline";
import CirclePipeline from "./CirclePipeline";
// import DragHandlesPipeline from "./DragHandlesPipeline";
import LinePipeline from "./LinePipeline";
import LitPipeline from "./LitPipeline";
import OutlinePipeline from "./OutlinePipeline";
// import Pipeline from "./Pipeline";
import PipelineInterface from "./PipelineInterface";
import ReticlePipeline from "./ReticlePipeline";
import TrajectoryPipeline from "./TrajectoryPipeline";

export type PipelineTypes =
  'lit' | 'pipeline' | 'line' | 'billboard' | 'drag-handles' | 'circle' | 'outline' | 'reticle' |
  'trajectory';

type Pipelines = {
  type: PipelineTypes,
  pipeline: PipelineInterface,
}

class PipelineManager {
  private static instance: PipelineManager | null = null;

  pipelines: Pipelines[] = [];

  private constructor() {
    this.pipelines = [];

    this.pipelines.push({ type: 'lit', pipeline: new LitPipeline() });
    // this.pipelines.push({ type: 'pipeline', pipeline: new Pipeline() })
    this.pipelines.push({ type: 'line', pipeline: new LinePipeline() });
    // this.pipelines.push({ type: 'billboard', pipeline: new BillboardPipeline() });
    // this.pipelines.push({ type: 'drag-handles', pipeline: new DragHandlesPipeline() });
    this.pipelines.push({ type: 'circle', pipeline: new CirclePipeline() });
    this.pipelines.push({ type: 'outline', pipeline: new OutlinePipeline() });
    this.pipelines.push({ type: 'reticle', pipeline: new ReticlePipeline() });
    this.pipelines.push({ type: 'trajectory', pipeline: new TrajectoryPipeline() });
  }

  public static getInstance(): PipelineManager {
    if (PipelineManager.instance === null) {
      PipelineManager.instance = new PipelineManager();
    }

    return this.instance!
  }

  getPipeline(type: PipelineTypes): PipelineInterface | null {
    const entry = this.pipelines.find((pipeline) => pipeline.type === type);

    if (entry) {
      return entry.pipeline;
    }

    console.log(`pipeline ${type} not found.`)

    return null;
  }
}

export default PipelineManager;
