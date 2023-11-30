import { Quat, Vec4, mat4, vec4 } from "wgpu-matrix";

export const degToRad = (d: number) => d * Math.PI / 180;
export const radToDeg = (r: number) => (r /  Math.PI) * 180;

export const normalizeDegrees = (d: number) => {
  let normalized = d % 360;
  if (normalized < 0) {
    normalized += 360;
  }

  return normalized;
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
