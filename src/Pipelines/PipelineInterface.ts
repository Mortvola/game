import DrawableInterface from "../Drawables/DrawableInterface";

interface PipelineInterface {
  render(passEncoder: GPURenderPassEncoder, drawables: DrawableInterface[]): void;
}

export default PipelineInterface;
