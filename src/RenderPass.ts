import PipelineInterface from "./Pipelines/PipelineInterface";
import { isContainerNode } from "./Drawables/SceneNodes/ContainerNode";
import PipelineManager from "./Pipelines/PipelineManager";
import { bindGroups } from "./Main";
import { DrawableNodeInterface, isDrawableNode } from "./Drawables/SceneNodes/DrawableNodeInterface";
import { SceneNodeInterface } from "./Drawables/SceneNodes/SceneNodeInterface";

type PipelineEntry = {
  pipeline: PipelineInterface,
  drawables: DrawableNodeInterface[],
}

class RenderPass {
  pipelines: PipelineEntry[] = [];

  addDrawable(drawable: DrawableNodeInterface) {
    const pipeline = PipelineManager.getInstance().getPipeline(drawable.pipelineType);

    if (pipeline) {
      let pipelineEntry = this.pipelines.find((p) => p.pipeline === pipeline) ?? null;

      if (!pipelineEntry) {
        this.pipelines.push({
          pipeline: pipeline,
          drawables: []
        })
  
        pipelineEntry = this.pipelines[this.pipelines.length - 1];
      }
  
      if (pipelineEntry) {
        pipelineEntry.drawables.push(drawable)
      }  
    }
  }

  removeDrawable(drawable: DrawableNodeInterface) {
    const pipeline = PipelineManager.getInstance().getPipeline(drawable.pipelineType);

    let pipelineEntry = this.pipelines.find((p) => p.pipeline === pipeline) ?? null;

    if (pipelineEntry) {
      const index = pipelineEntry.drawables.findIndex((d) => d === drawable)

      if (index !== -1) {
        pipelineEntry.drawables = [
          ...pipelineEntry.drawables.slice(0, index),
          ...pipelineEntry.drawables.slice(index + 1),
        ]
      }
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

    this.pipelines.forEach((entry) => {
      entry.pipeline.render(passEncoder, entry.drawables);
      entry.drawables = [];
    })

    this.pipelines = [];

    passEncoder.end();
  }
}

export default RenderPass;
