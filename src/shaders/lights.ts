export const lights = /*wgsl*/`
struct PointLight {
  position: vec4f,
  color: vec4f,
}

struct Lights {
  directional: vec4f,
  directionalColor: vec4f,
  count: u32,
  lights: array<PointLight, 4>,
}

@group(0) @binding(4) var<storage> pointLights: Lights;
`
