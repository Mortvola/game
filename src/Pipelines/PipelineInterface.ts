import { DrawableNodeInterface } from "../Drawables/SceneNodes/DrawableNodeInterface";

interface PipelineInterface {
  render(passEncoder: GPURenderPassEncoder, drawables: DrawableNodeInterface[]): void;
}

export default PipelineInterface;
