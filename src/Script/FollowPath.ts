import { vec2, vec3 } from "wgpu-matrix";
import { PathPoint } from "../Workers/PathPlannerTypes";
import { ActorInterface, WorldInterface } from "../types";
import { SceneNodeInterface } from "../Renderer/types";

class FollowPath implements ActorInterface {
  path: PathPoint[];

  sceneNode: SceneNodeInterface;

  metersPerSecond: number;

  ground: boolean;

  onFinish: (() => void) | null = null;

  constructor(sceneNode: SceneNodeInterface, path: PathPoint[], ground = true, metersPerSecond = 6) {
    this.sceneNode = sceneNode;
    this.path = path;
    this.ground = ground;
    this.metersPerSecond = metersPerSecond;
  }

  async update(elapsedTime: number, timestamp: number, world: WorldInterface): Promise<boolean> {
    if (this.path.length < 2) {
      return true;
    }

    for (;;) {
      let speedFactor = 1.0;
      if (this.ground && this.path[this.path.length - 1].difficult) {
        speedFactor = 0.5;
      }

      const moveTo = this.path[this.path.length - 2].point;

      // Get the distance to target Using the mesh's world
      // position (found in mesh.translate) and the target location
      const distanceToTarget = vec2.distance(
        vec2.create(
          this.sceneNode.translate[0],
          this.sceneNode.translate[2],
        ),
        moveTo,
      );

      if (this.metersPerSecond * speedFactor * elapsedTime > distanceToTarget) {
        this.sceneNode.translate[0] = moveTo[0];
        this.sceneNode.translate[2] = moveTo[1];

        this.path.pop();

        if (this.path.length < 2) {
          break;
        }

        const consumedTime = distanceToTarget / (this.metersPerSecond * speedFactor);
        elapsedTime -= consumedTime;

      } else {
        // Create a unit vector to the target.
        let v = vec3.normalize(vec3.create(
          moveTo[0] - this.sceneNode.translate[0],
          0,
          moveTo[1] - this.sceneNode.translate[2],
        ));

        // Scale by the distance to move in this period of time
        v = vec3.mulScalar(v, elapsedTime * this.metersPerSecond * speedFactor);

        // Add it to the current position to get the new position.
        this.sceneNode.translate[0] += v[0];
        this.sceneNode.translate[2] += v[2];

        break;
      }
    }

    if (this.path.length < 2) {
      if (this.onFinish) {
        this.onFinish();
      }

      return true;
    }

    return false;
  }
}

export default FollowPath;
