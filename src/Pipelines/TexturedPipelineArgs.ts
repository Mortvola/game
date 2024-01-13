import { PipelineArgs } from "./PipelineArgs";
import { bindGroups } from '../BindGroups';
import { gpu } from "../Gpu";

class TexturedPipelineArgs implements PipelineArgs {
  bitmap: ImageBitmap;

  bindGroup3: GPUBindGroup;

  static label = 'TexturedPipelineArgs';

  constructor(bitmap: ImageBitmap) {
    this.bitmap = bitmap;

    const texture = gpu.device.createTexture({
      label: TexturedPipelineArgs.label,
      format: 'rgba8unorm',
      size: [bitmap.width, bitmap.height],
      usage: GPUTextureUsage.TEXTURE_BINDING |
             GPUTextureUsage.COPY_DST |
             GPUTextureUsage.RENDER_ATTACHMENT,
    });

    gpu.device.queue.copyExternalImageToTexture(
      { source: bitmap },
      { texture },
      { width: bitmap.width, height: bitmap.height },
    );

    const sampler = gpu.device.createSampler({
      label: TexturedPipelineArgs.label,
    });
    
    this.bindGroup3 = gpu.device.createBindGroup({
      label: TexturedPipelineArgs.label,
      layout: bindGroups.getBindGroupLayout3(),
      entries: [
        { binding: 0, resource: sampler },
        { binding: 1, resource: texture.createView() },
      ],
    });
  }

  static async create(textureUrl: string): Promise<TexturedPipelineArgs> {
    const res = await fetch(textureUrl);
    if (!res.ok) {
      throw new Error(`failed to fetch texture: ${textureUrl}`)
    }

    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob, { colorSpaceConversion: 'none' });

    return new TexturedPipelineArgs(bitmap);
  }
}

export default TexturedPipelineArgs;
