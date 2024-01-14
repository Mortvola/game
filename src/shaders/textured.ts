import { common } from "./common";
import { texturedFragment } from "./texturedFragment";

export const texturedShader = /*wgsl*/`
struct Vertex {
  @location(0) position: vec4f,
  @location(1) normal: vec4f,
  @location(2) texcoord: vec2f,
}

struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) texcoord: vec2f,
}

${common}

@vertex
fn vs(
  @builtin(instance_index) instanceIndex: u32,
  vert: Vertex,
) -> VertexOut
{
  var output: VertexOut;

  output.position = projectionMatrix * viewMatrix * modelMatrix[instanceIndex] * vert.position;
  output.texcoord = vert.texcoord;

  return output;
}

${texturedFragment}
`
