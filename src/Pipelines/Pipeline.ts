import { gpu } from "../Main";
import DrawableInterface from "../Drawables/DrawableInterface";
import { DrawableNodeInterface, PipelineInterface } from "../types";

class Pipeline implements PipelineInterface {
  pipeline: GPURenderPipeline | null = null;

  drawables: DrawableInterface[] = [];

  addDrawable(drawableNode: DrawableNodeInterface): void {
    let entry = this.drawables.find((d) => d === drawableNode.drawable);

    if (!entry) {
      this.drawables.push(drawableNode.drawable);
    }
  }

  removeDrawable(drawable: DrawableNodeInterface): void {
    throw new Error("Method not implemented.");
  }

  render(passEncoder: GPURenderPassEncoder) {
    if (this.pipeline) {
      if (!gpu) {
        throw new Error('gpu device not set.')
      }
  
      passEncoder.setPipeline(this.pipeline);

      for (const drawable of this.drawables) {
        gpu.device.queue.writeBuffer(drawable.modelMatrixBuffer, 0, drawable.modelMatrices);
        gpu.device.queue.writeBuffer(drawable.colorBuffer, 0, drawable.color);

        passEncoder.setBindGroup(1, drawable.bindGroup);

        drawable.render(passEncoder, drawable.numInstances);

        drawable.numInstances = 0;
      }  
    }

    this.drawables = [];
  }
}

export default Pipeline;
