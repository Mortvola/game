import { vec4, mat4, quat, Vec4, Mat4 } from 'wgpu-matrix';
import { normalizeDegrees, degToRad } from './Math';
import { audioContext } from './Audio';

export type ProjectionType = 'Perspective' | 'Orthographic';

class Camera {
  projection: ProjectionType = 'Perspective';

  perspectiveTransform = mat4.identity();

  orthographicTransform = mat4.identity();

  viewTransform = mat4.identity();

  offset = 18;

  position = vec4.create(0, 0, 20, 1);

  rotateX = -35;

  rotateY = 0;

  near = 0.125;
  
  far = 2000;

  moveDirection = vec4.create(0, 0, 0, 0);

  currentVelocity = vec4.create(0, 0, 0, 0);

  maxVelocity = 10;

  updatePosition(elapsedTime: number) {
    const cameraQuat = quat.fromEuler(degToRad(0), degToRad(this.rotateY), degToRad(0), "yxz");
    const rotationMatrix = mat4.fromQuat(cameraQuat);

    const deltaVector = vec4.subtract(vec4.mulScalar(this.moveDirection, this.maxVelocity), this.currentVelocity);

    // const direction = vec4.mulScalar(this.moveDirection, elapsedTime * this.maxVelocity);
    this.currentVelocity = vec4.add(this.currentVelocity, vec4.mulScalar(deltaVector, elapsedTime * 6));

    const change = vec4.mulScalar(this.currentVelocity, elapsedTime);

    const direction = vec4.transformMat4(change, rotationMatrix)

    this.position[0] += direction[0];
    this.position[2] += direction[2];

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

    this.updateListener();
  }

  updateListener() {
    const listener = audioContext.listener;

    const listenerPosition = vec4.transformMat4(
      vec4.create(0, 0, 0, 1),
      this.viewTransform,
    )

    listener.positionX.value = listenerPosition[0];
    listener.positionY.value = listenerPosition[1];
    listener.positionZ.value = listenerPosition[2];

    const listenerOrientation = vec4.transformMat4(
      vec4.create(0, 0, -1, 0),
      this.viewTransform,
    )

    listener.forwardX.value = listenerOrientation[0];
    listener.forwardY.value = listenerOrientation[1];
    listener.forwardZ.value = listenerOrientation[2];

    listener.upX.value = 0;
    listener.upY.value = 1;
    listener.upZ.value = 0;
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
