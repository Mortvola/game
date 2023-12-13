import { Quat, Vec3, Vec4, mat4, vec3, vec4 } from "wgpu-matrix";

export const degToRad = (d: number) => d * Math.PI / 180;
export const radToDeg = (r: number) => (r /  Math.PI) * 180;

export const normalizeDegrees = (d: number) => {
  let normalized = d % 360;
  if (normalized < 0) {
    normalized += 360;
  }

  return normalized;
}

// Implementation of the Möller-Trumbore algorithm
export const intersectTriangle = (
  origin: Vec3, dir: Vec3, v0: Vec3, v1: Vec3, v2: Vec3,
): [number, number, number] | null => {
  const epsilon = 0.000001;

  const edge1 = vec3.subtract(v1, v0);
  const edge2 = vec3.subtract(v2, v0);

  const pvec = vec3.cross(dir, edge2);

  const det = vec3.dot(edge1, pvec);

  if (det < epsilon) {
    return null;
  }

  const inverseDet = 1 / det;

  const tvec = vec3.subtract(origin, v0);

  const u = vec3.dot(tvec, pvec) * inverseDet;
  if (u < 0.0 || u > 1.0) {
    return null;
  }

  const qvec = vec3.cross(tvec, edge1);

  const v = vec3.dot(dir, qvec) * inverseDet;
  if (v < 0.0 || u + v > 1.0) {
    return null;
  }

  const t = vec3.dot(edge2, qvec) * inverseDet;

  return [t, u, v];
}

export const intersectionPlane = (planePoint: Vec4, planeNormal: Vec4, origin: Vec4, ray: Vec4): Vec4 | null => {
  const denom = vec4.dot(ray, planeNormal);

  if (denom < -1e-6 || denom > 1e-6) {
    const v = vec4.subtract(planePoint, origin);
    const t = vec4.dot(v, planeNormal) / denom;

    if (t >= 0) {
      return vec4.add(origin, vec4.mulScalar(ray, t))
    }
  }

  return null;
}

const clamp = (v: number, l: number, h: number): number => {
  if (v < l) {
    return l;
  }

  if (v > h) {
    return h;
  }

  return v;
}

export const getEulerAngles = (q: Quat) => {
  const m = mat4.fromQuat(q)

  let x;
  let z;
  const y = Math.asin( clamp( m[8], -1, 1 ) );

  if ( Math.abs( m[8] ) < 0.9999999 ) {
    x = Math.atan2(-m[9], m[10] );
    z = Math.atan2(-m[4], m[0] );
  } else {
    x = Math.atan2( m[6], m[5] );
    z = 0;
  }

  return [x, y, z];
}

// Gravitational constant in meters / sec^2
export const gravity = -9.81;

// Minimum velocity needed to hit target
// This assumes the starting position is at (0, 0)
// Given that the gravitational constant is in meters, all parameters are in meters.
export const minimumVelocity = (targetX: number, targetY: number) => (
  Math.sqrt(
    Math.sqrt(
      Math.pow(gravity, 2) * (Math.pow(targetX, 2) + Math.pow(targetY, 2)) - gravity * targetY
    )
  )
)

// Find the needed angles of launch (high and low)
// Given that the gravitational constant is in meters, all parameters are in meters.
export const anglesOfLaunch = (velocity: number, targetX: number, targetY: number) => {
  const sqrtTerm = Math.sqrt(
    Math.pow(velocity, 4) - gravity * (gravity * Math.pow(targetX, 2) - 2 * Math.pow(velocity, 2) * targetY)
  )

  // Note: we negate the Y component (second paramter) just to get atan2 to return a value in the correct quadrant.
  const lowAngle = Math.atan2((Math.pow(velocity, 2) - sqrtTerm),  -(gravity * targetX))
  const highAngle = Math.atan2((Math.pow(velocity, 2) + sqrtTerm), -(gravity * targetX))

  return [lowAngle, highAngle];
}

// Find the time to target given the target X, velocity and angle (in radians).
export const timeToTarget = (targetX: number, velocity: number, angle: number) => (
  targetX / (velocity * Math.cos(angle))
)


export const feetToMeters = (feet: number) => (
  feet * 0.3048
)
