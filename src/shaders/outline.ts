import { common } from "./common";

export const outlineShader = /*wgsl*/`
struct Vertex {
  @location(0) position: vec4f,
  @location(1) normal: vec4f,
}

struct VertexOut {
  @builtin(position) position : vec4f,
}

${common}

@group(1) @binding(1) var<uniform> color: vec4f;

@vertex
fn vs(vert: Vertex) -> VertexOut
{
  var output: VertexOut;

  var expansion = vert.position + vert.normal * 0.2;
  var scale = mat4x4f(
    1.05, 0.0, 0.0, 0.0,
    0.0, 1.05, 0.0, 0.0,
    0.0, 0.0, 1.05, 0.0,
    0.0, 0.0, 0.0, 1.0,
  );
  output.position = projectionMatrix * viewMatrix * modelMatrix * scale * vert.position;

  return output;
}

@fragment
fn fs(fragData: VertexOut) -> @location(0) vec4f
{
  return vec4f(1.0, 1.0, 0.0, 1.0);
}
`
