export const texturedFragment = /*wgsl*/`
@group(3) @binding(0) var ourSampler: sampler;
@group(3) @binding(1) var ourTexture: texture_2d<f32>;

@fragment
fn fs(fragData: VertexOut) -> @location(0) vec4f
{
  return textureSample(ourTexture, ourSampler, fragData.texcoord);
}
`
