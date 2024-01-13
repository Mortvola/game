import { pipelineManager } from "../Main";
import { PipelineType } from "../Pipelines/PipelineManager";
import { MaterialInterface, PipelineInterface } from "../types";
import { MaterialDescriptor } from "./MaterialDescriptor";

class Material implements MaterialInterface {
  pipeline: PipelineInterface | null = null;

  constructor(materialDescriptor: MaterialDescriptor) {
    this.pipeline = pipelineManager.getPipeline(materialDescriptor.type as PipelineType)
  }
}

export default Material;
