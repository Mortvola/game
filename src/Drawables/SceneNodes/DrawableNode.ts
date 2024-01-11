import { Vec4, mat4, vec4 } from "wgpu-matrix";
import DrawableInterface from "../DrawableInterface";
import SceneNode from "./SceneNode";
import { DrawableNodeInterface } from "./DrawableNodeInterface";
import { PipelineType } from "../../Pipelines/PipelineManager";

class DrawableNode extends SceneNode implements DrawableNodeInterface {
  drawable: DrawableInterface;

  pipelineType: PipelineType;

  constructor(drawable: DrawableInterface, pipelinType: PipelineType) {
    super();
    this.drawable = drawable;
    this.pipelineType = pipelinType;
  }

  hitTest(origin: Vec4, vector: Vec4): { point: Vec4, t: number, drawable: DrawableInterface} | null {
    // Transform origin and ray into model space.
    const inverseTransform = mat4.inverse(this.getTransform());
    const localVector = vec4.transformMat4(vector, inverseTransform);
    const localOrigin = vec4.transformMat4(origin, inverseTransform);

    const result = this.drawable.hitTest(localOrigin, localVector);

    if (result) {
      // Convert the intersection point into world coordinates.
      const point = vec4.transformMat4(result.point, this.getTransform());

      return { point, t: result.t, drawable: this.drawable };      
    }

    return null;
  }
}

export default DrawableNode;
