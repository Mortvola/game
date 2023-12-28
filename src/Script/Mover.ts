import { Vec2, vec2, vec3 } from "wgpu-matrix";
import { ActorInterface, ActorOnFinishCallback } from "../ActorInterface";
import { WorldInterface } from "../WorldInterface";
import SceneNode from "../Drawables/SceneNode";

class Mover implements ActorInterface {
  onFinish: ActorOnFinishCallback | null = null;

  sceneNode: SceneNode;

  moveTo: Vec2;

  metersPerSecond = 8;

  constructor(sceneNode: SceneNode, moveTo: Vec2, onFinish?: ActorOnFinishCallback) {
    this.sceneNode = sceneNode;
    this.moveTo = moveTo;
    this.onFinish = onFinish ?? null;
  }

  update(elapsedTime: number, timestamp: number, world: WorldInterface): boolean {
    // Get the distance to target Using the mesh's world
    // position (found in mesh.translate) and the target location
    const distanceToTarget = vec2.distance(
      vec2.create(
        this.sceneNode.translate[0],
        this.sceneNode.translate[2],
      ),
      this.moveTo,
    );

    if (this.metersPerSecond * elapsedTime > distanceToTarget) {
      this.sceneNode.translate[0] = this.moveTo[0];
      this.sceneNode.translate[2] = this.moveTo[1];

      if (this.onFinish) {
        this.onFinish(timestamp)
      }

      return true;
    }

    // Create a unit vector to the target.
    let v = vec3.normalize(vec3.create(
      this.moveTo[0] - this.sceneNode.translate[0],
      0,
      this.moveTo[1] - this.sceneNode.translate[2],
    ));

    // Scale by the distance to move in this period of time
    v = vec3.mulScalar(v, elapsedTime * this.metersPerSecond);

    // Add it to the current position to get the new position.
    this.sceneNode.translate[0] += v[0];
    this.sceneNode.translate[2] += v[2];

    return false;
  }
}

export default Mover;
