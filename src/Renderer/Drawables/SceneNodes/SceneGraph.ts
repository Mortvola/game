import { mat4 } from "wgpu-matrix";
import { RendererInterface, SceneGraphInterface, SceneNodeInterface } from "../../types";
import Light, { isLight } from "../Light";
import RangeCircle from "../RangeCircle";
import ContainerNode, { isContainerNode } from "./ContainerNode";

class SceneGraph implements SceneGraphInterface {
  scene = new ContainerNode()

  lights: Set<Light> = new Set();

  rangeCircles: Set<RangeCircle> = new Set();

  addNode(node: SceneNodeInterface) {
    this.scene.addNode(node);

    let stack: SceneNodeInterface[] = [node]

    while (stack.length > 0) {
      const n = stack[0];
      stack = stack.slice(1);

      if (isContainerNode(n)) {
        stack.push(...n.nodes)
      }
      else if (isRangeCircle(n)) {
        this.rangeCircles.add(n)
      }
      else if (isLight(n)) {
        this.lights.add(n)
      }
    }
  }

  removeNode(node: SceneNodeInterface) {
    this.scene.removeNode(node);

    let stack: SceneNodeInterface[] = [node]

    while (stack.length > 0) {
      const n = stack[0];
      stack = stack.slice(1);

      if (isContainerNode(n)) {
        stack.push(...n.nodes)
      }
      else if (isRangeCircle(n)) {
        this.rangeCircles.delete(n)
      }
      else if (isLight(n)) {
        this.lights.delete(n)
      }
    }
  }

  updateTransforms(renderer: RendererInterface) {
    this.scene.updateTransforms(undefined, renderer);
  }

  getRangeCircles() : RangeCircle[] {
    const circles: RangeCircle[] = [];

    this.rangeCircles.forEach((c) => circles.push(c))
    
    return circles
  }
}

const isRangeCircle = (r: unknown): r is RangeCircle => (
  (r as RangeCircle).radius !== undefined
  && (r as RangeCircle).thickness !== undefined
)

export default SceneGraph;
