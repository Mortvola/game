import PipelineInterface from "./Pipelines/PipelineInterface";
import { isContainerNode } from "./Drawables/SceneNodes/ContainerNode";
import { bindGroups } from "./Main";
import { DrawableNodeInterface, isDrawableNode } from "./Drawables/SceneNodes/DrawableNodeInterface";
import { SceneNodeInterface } from "./Drawables/SceneNodes/SceneNodeInterface";

class RenderPass {
  pipelines: PipelineInterface[] = [];

  addDrawable(drawable: DrawableNodeInterface) {
    const pipeline = drawable.pipeline;

    if (pipeline) {
      let pipelineEntry = this.pipelines.find((p) => p === pipeline) ?? null;

      if (!pipelineEntry) {
        this.pipelines.push(pipeline);
  
        pipelineEntry = pipeline; // this.pipelines[this.pipelines.length - 1];
      }
  
      if (pipelineEntry) {
        pipelineEntry.addDrawable(drawable)
      }  
    }
  }

  removeDrawable(drawable: DrawableNodeInterface) {
    const pipeline = drawable.pipeline;

    let pipelineEntry = this.pipelines.find((p) => p === pipeline) ?? null;

    if (pipelineEntry) {
      pipelineEntry.removeDrawable(drawable);
    }
  }

  addDrawables(node: SceneNodeInterface) {
    if (isContainerNode(node)) {
      for (const drawable of node.nodes) {
        this.addDrawables(drawable)
      }  
    }
    else if (isDrawableNode(node)) {
      this.addDrawable(node);
    }
  }

  removeDrawables(node: SceneNodeInterface) {
    if (isContainerNode(node)) {
      for (const drawable of node.nodes) {
        this.removeDrawables(drawable)
      }
    }
    else if (isDrawableNode(node)) {
      this.removeDrawable(node);
    }
  }

  getDescriptor(view: GPUTextureView, depthView: GPUTextureView | null): GPURenderPassDescriptor {
    const descriptor: GPURenderPassDescriptor = {
      label: 'main render pass',
      colorAttachments: [
        {
          view,
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: "clear" as GPULoadOp,
          storeOp: "store" as GPUStoreOp,
        },
      ],
    };

    if (depthView) {
      descriptor.depthStencilAttachment = {
        view: depthView,
        depthClearValue: 1.0,
        depthLoadOp: "clear" as GPULoadOp,
        depthStoreOp: "store" as GPUStoreOp,
      };
    }

    return descriptor;
  }

  render(view: GPUTextureView, depthView: GPUTextureView | null, commandEncoder: GPUCommandEncoder) {
    if (!bindGroups.camera) {
      throw new Error('uniformBuffer is not set');
    }

    const passEncoder = commandEncoder.beginRenderPass(this.getDescriptor(view, depthView));

    passEncoder.setBindGroup(0, bindGroups.camera.bindGroup);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let drawableCount = 0;

    this.pipelines.forEach((pipeline) => {
      drawableCount += pipeline.drawables.length;
      pipeline.render(passEncoder);
    })

    // console.log(`rendered ${drawableCount} drawables across ${this.pipelines.length} pipelines`);

    this.pipelines = [];

    passEncoder.end();
  }
}

export default RenderPass;
