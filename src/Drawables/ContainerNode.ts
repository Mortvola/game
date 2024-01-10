import { Vec4, mat4 } from 'wgpu-matrix';
import DrawableInterface from "./DrawableInterface";
import SceneNode from "./SceneNode";
import { PipelineTypes } from '../Pipelines/PipelineManager';
import { isDrawableNode } from './DrawableNodeInterface';

export type HitTestResult = {
  drawable: DrawableInterface,
  t: number,
  point: Vec4,
}

class ContainerNode extends SceneNode {
  nodes: {
    node: SceneNode,
    pipelineType: PipelineTypes,
  }[] = [];

  // constructor() {
  //   super();

  //   // makeObservable(this, {
  //   //   nodes: observable,
  //   // })
  // }

  addNode(node: SceneNode, pipelineType: PipelineTypes) {
    // runInAction(() => {
      this.nodes.push({ node, pipelineType });
    // })
  }

  removeNode(node: SceneNode) {
    const index = this.nodes.findIndex((n) => n.node === node);

    if (index !== -1) {
      this.nodes = [
        ...this.nodes.slice(0, index),
        ...this.nodes.slice(index + 1)
      ]
    }
  }

  findNode(node: SceneNode) {
    const index = this.nodes.findIndex((n) => n.node === node);

    if (index === -1) {
      console.log('node not found!!!!')
    }
  }

  updateTransforms(mat = mat4.identity()) {
    const transform = this.computeTransform(mat);
    for (const drawable of this.nodes) {
      if (isDrawableNode(drawable.node)) {
        drawable.node.computeTransform(transform);
      }
      else if (isContainerNode(drawable.node)) {
        // const nodeMat = drawable.node.computeTransform(transform);
        drawable.node.updateTransforms(transform);
      }
    }
  }

  resetTransforms() {
    for (const node of this.nodes) {
      if (isDrawableNode(node.node)) {
        node.node.drawable.resetTransforms();
      }
      else if (isContainerNode(node.node)) {
        // const nodeMat = drawable.node.computeTransform(transform);
        node.node.resetTransforms();
      }
    }
  }

  modelHitTest(origin: Vec4, ray: Vec4, filter?: (node: DrawableInterface) => boolean): HitTestResult | null {
    let best: HitTestResult | null = null;

    for (const node of this.nodes) {
      let result;
      if (isDrawableNode(node.node)) {
        if (!filter || filter(node.node.drawable)) {
          result = node.node.hitTest(origin, ray)    
        }
      }
      else if (isContainerNode(node.node)) {
        result = node.node.modelHitTest(origin, ray, filter);
      }

      if (result) {
        if (best === null || result.t < best.t) {
          best = {
            drawable: result.drawable,
            t: result.t,
            point: result.point,
          }
        }
      }  
    }

    return best;
  }
}

export const isContainerNode = (r: unknown): r is ContainerNode => (
  (r as ContainerNode).nodes !== undefined
)

export default ContainerNode;
