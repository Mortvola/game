import { textureAttributes } from "./textureAttributes";

export const texturedFragment = /*wgsl*/`
${textureAttributes}

@group(2) @binding(1) var ourSampler: sampler;
@group(2) @binding(2) var ourTexture: texture_2d<f32>;
@group(2) @binding(3) var<uniform> texAttr: TextureAttributes;

@fragment
fn fs(fragData: VertexOut) -> @location(0) vec4f
{
  return textureSample(ourTexture, ourSampler, fract(fragData.texcoord * texAttr.scale + texAttr.offset));
}
`
