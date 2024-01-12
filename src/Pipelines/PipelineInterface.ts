import DrawableInterface from "../Drawables/DrawableInterface";
import { DrawableNodeInterface } from "../Drawables/SceneNodes/DrawableNodeInterface";

interface PipelineInterface {
  drawables: DrawableInterface[];

  addDrawable(drawable: DrawableNodeInterface): void;

  removeDrawable(drawable: DrawableNodeInterface): void;

  render(passEncoder: GPURenderPassEncoder): void;
}

export default PipelineInterface;
