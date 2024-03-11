import { Vec2, vec2, vec3 } from "wgpu-matrix";
import { ActorInterface, ActorOnFinishCallback, WorldInterface } from "../types";
import { SceneObjectInterface } from "../Renderer/types";

class Mover implements ActorInterface {
  onFinish: ActorOnFinishCallback | null = null;

  sceneObject: SceneObjectInterface;

  moveTo: Vec2;

  metersPerSecond = 6;

  world: WorldInterface;

  constructor(sceneObject: SceneObjectInterface, moveTo: Vec2, world: WorldInterface, onFinish?: ActorOnFinishCallback) {
    this.sceneObject = sceneObject;
    this.moveTo = moveTo;
    this.onFinish = onFinish ?? null;
    this.world = world;
  }

  async update(elapsedTime: number, timestamp: number): Promise<boolean> {
    // Get the distance to target Using the mesh's world
    // position (found in mesh.translate) and the target location
    const distanceToTarget = vec2.distance(
      vec2.create(
        this.sceneObject.sceneNode.translate[0],
        this.sceneObject.sceneNode.translate[2],
      ),
      this.moveTo,
    );

    if (this.metersPerSecond * elapsedTime > distanceToTarget) {
      this.sceneObject.sceneNode.translate[0] = this.moveTo[0];
      this.sceneObject.sceneNode.translate[2] = this.moveTo[1];

      if (this.onFinish) {
        this.onFinish(timestamp)
      }

      return true;
    }

    // Create a unit vector to the target.
    let v = vec3.normalize(vec3.create(
      this.moveTo[0] - this.sceneObject.sceneNode.translate[0],
      0,
      this.moveTo[1] - this.sceneObject.sceneNode.translate[2],
    ));

    // Scale by the distance to move in this period of time
    v = vec3.mulScalar(v, elapsedTime * this.metersPerSecond);

    // Add it to the current position to get the new position.
    this.sceneObject.sceneNode.translate[0] += v[0];
    this.sceneObject.sceneNode.translate[2] += v[2];

    return false;
  }
}

export default Mover;
