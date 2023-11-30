import { vec4, mat4, quat, Vec4, Mat4 } from 'wgpu-matrix';
import { normalizeDegrees, degToRad } from './Math';

export type ProjectionType = 'Perspective' | 'Orthographic';

class Camera {
  projection: ProjectionType = 'Perspective';

  perspectiveTransform = mat4.identity();

  orthographicTransform = mat4.identity();

  viewTransform = mat4.identity();

  offset = 30;

  position = vec4.create(0, 5, 50, 0);

  rotateX = -5;

  rotateY = 0;

  near = 0.125;
  
  far = 2000;

  moveDirection = vec4.create(0, 0, 0, 0);

  updatePosition(elapsedTime: number) {
    const cameraQuat = quat.fromEuler(degToRad(0), degToRad(this.rotateY), degToRad(0), "yxz");
    const t = mat4.fromQuat(cameraQuat);

    const direction = vec4.mulScalar(this.moveDirection, elapsedTime * 30);

    const change = vec4.transformMat4(direction, t)

    this.position[0] += change[0];
    this.position[2] += change[2];

    this.computeViewTransform();
  }

  changeRotation(deltaX: number) {
    this.rotateY = normalizeDegrees(this.rotateY + deltaX);

    this.computeViewTransform();
  }

  computeViewTransform() {
    this.viewTransform = mat4.identity();

    const cameraQuat = quat.fromEuler(degToRad(this.rotateX), degToRad(this.rotateY), degToRad(0), "yxz");
    const t = mat4.fromQuat(cameraQuat);
    
    const translate1 = mat4.translation(this.position);
    const translate2 = mat4.translation(vec4.create(0, 0, this.offset));

    mat4.multiply(this.viewTransform, translate1, this.viewTransform)
    mat4.multiply(this.viewTransform, t, this.viewTransform)
    mat4.multiply(this.viewTransform, translate2, this.viewTransform)
  }

  ndcToCameraSpace(x: number, y: number) {
    let inverseMatrix: Mat4;
    if (this.projection === 'Perspective') {
      inverseMatrix = mat4.inverse(this.perspectiveTransform);
    }
    else {
      inverseMatrix = mat4.inverse(this.orthographicTransform);
    }

    // Transform point from NDC to camera space.
    let point = vec4.create(x, y, 0, 1);
    point = vec4.transformMat4(point, inverseMatrix);
    point = vec4.divScalar(point, point[3])

    return point;
  }

  // Returns ray and origin in world space coordinates.
  computeHitTestRay(x: number, y: number): { ray: Vec4, origin: Vec4 } {
    let point = this.ndcToCameraSpace(x, y);
  
    // Transform point and camera to world space.
    point = vec4.transformMat4(point, this.viewTransform)
    const origin = vec4.transformMat4(vec4.create(0, 0, 0, 1), this.viewTransform);

    // Compute ray from camera through point
    let ray = vec4.subtract(point, origin);
    ray[3] = 0;
    ray = vec4.normalize(ray);

    return ({
      ray,
      origin,
    })
  }  
}

export default Camera;
