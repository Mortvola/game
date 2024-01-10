import { DrawableNodeInterface } from "../Drawables/DrawableNodeInterface";

interface PipelineInterface {
  render(passEncoder: GPURenderPassEncoder, drawables: DrawableNodeInterface[]): void;
}

export default PipelineInterface;
