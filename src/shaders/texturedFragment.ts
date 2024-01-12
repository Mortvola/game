export const texturedFragment = /*wgsl*/`
@group(2) @binding(1) var ourSampler: sampler;
@group(2) @binding(2) var ourTexture: texture_2d<f32>;

@fragment
fn fs(fragData: VertexOut) -> @location(0) vec4f
{
  return textureSample(ourTexture, ourSampler, fragData.texcoord);
}
`
