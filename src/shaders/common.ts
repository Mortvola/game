export const common = /*wgsl*/`
@group(0) @binding(0) var<uniform> projectionMatrix: mat4x4f;
@group(0) @binding(1) var<uniform> viewMatrix: mat4x4f;
@group(0) @binding(2) var<uniform> cameraPos: vec4f;
@group(0) @binding(3) var<uniform> aspectRatio: f32;

@group(1) @binding(0) var<uniform> modelMatrix: array<mat4x4f, 16>;
`