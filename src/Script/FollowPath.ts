import { Vec2, vec2, vec3 } from "wgpu-matrix";
import { ActorInterface } from "../ActorInterface";
import { WorldInterface } from "../WorldInterface";
import SceneNode from "../Drawables/SceneNode";
import { PathPoint } from "../Workers/PathPlannerTypes";

class FollowPath implements ActorInterface {
  path: PathPoint[];

  sceneNode: SceneNode;

  metersPerSecond = 6;

  constructor(sceneNode: SceneNode, path: PathPoint[]) {
    this.sceneNode = sceneNode;
    this.path = path;
  }

  async update(elapsedTime: number, timestamp: number, world: WorldInterface): Promise<boolean> {
    if (this.path.length === 0) {
      return true;
    }

    for (;;) {
      const moveTo = this.path[this.path.length - 1].point;

      // Get the distance to target Using the mesh's world
      // position (found in mesh.translate) and the target location
      const distanceToTarget = vec2.distance(
        vec2.create(
          this.sceneNode.translate[0],
          this.sceneNode.translate[2],
        ),
        moveTo,
      );

      if (this.metersPerSecond * elapsedTime > distanceToTarget) {
        this.sceneNode.translate[0] = moveTo[0];
        this.sceneNode.translate[2] = moveTo[1];

        this.path.pop();

        if (this.path.length === 0) {
          break;
        }

        const consumedTime = distanceToTarget / this.metersPerSecond;
        elapsedTime -= consumedTime;

      } else {
        // Create a unit vector to the target.
        let v = vec3.normalize(vec3.create(
          moveTo[0] - this.sceneNode.translate[0],
          0,
          moveTo[1] - this.sceneNode.translate[2],
        ));

        // Scale by the distance to move in this period of time
        v = vec3.mulScalar(v, elapsedTime * this.metersPerSecond);

        // Add it to the current position to get the new position.
        this.sceneNode.translate[0] += v[0];
        this.sceneNode.translate[2] += v[2];

        break;
      }
    }

    return this.path.length === 0;
  }
}

export default FollowPath;
