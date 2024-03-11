import { vec2, vec3 } from "wgpu-matrix";
import { PathPoint } from "../Workers/PathPlannerTypes";
import { ActorInterface, WorldInterface } from "../types";
import { SceneObjectInterface } from "../Renderer/types";

class FollowPath implements ActorInterface {
  path: PathPoint[];

  sceneObject: SceneObjectInterface;

  metersPerSecond: number;

  ground: boolean;

  world: WorldInterface;

  onFinish: (() => void) | null = null;

  constructor(sceneObject: SceneObjectInterface, path: PathPoint[], world: WorldInterface, ground = true, metersPerSecond = 6) {
    this.sceneObject = sceneObject;
    this.path = path;
    this.ground = ground;
    this.metersPerSecond = metersPerSecond;
    this.world = world;
  }

  async update(elapsedTime: number, timestamp: number): Promise<boolean> {
    if (this.path.length < 2) {
      return true;
    }

    this.sceneObject.update(timestamp, elapsedTime)
    
    for (;;) {
      let speedFactor = 1.0;
      if (this.ground && this.path[this.path.length - 1].difficult) {
        speedFactor = 0.5;
      }

      const moveTo = this.path[this.path.length - 2].point;

      const angle = Math.atan2(moveTo[0] - this.sceneObject.sceneNode.translate[0], moveTo[1] - this.sceneObject.sceneNode.translate[2]);
      this.sceneObject.sceneNode.setFromAngles(0, angle, 0);
  
      // Get the distance to target Using the mesh's world
      // position (found in mesh.translate) and the target location
      const distanceToTarget = vec2.distance(
        vec2.create(
          this.sceneObject.sceneNode.translate[0],
          this.sceneObject.sceneNode.translate[2],
        ),
        moveTo,
      );

      if (this.metersPerSecond * speedFactor * elapsedTime > distanceToTarget) {
        this.sceneObject.sceneNode.translate[0] = moveTo[0];
        this.sceneObject.sceneNode.translate[2] = moveTo[1];

        this.path.pop();

        if (this.path.length < 2) {
          break;
        }

        const consumedTime = distanceToTarget / (this.metersPerSecond * speedFactor);
        elapsedTime -= consumedTime;

      } else {
        // Create a unit vector to the target.
        let v = vec3.normalize(vec3.create(
          moveTo[0] - this.sceneObject.sceneNode.translate[0],
          0,
          moveTo[1] - this.sceneObject.sceneNode.translate[2],
        ));

        // Scale by the distance to move in this period of time
        v = vec3.mulScalar(v, elapsedTime * this.metersPerSecond * speedFactor);

        // Add it to the current position to get the new position.
        this.sceneObject.sceneNode.translate[0] += v[0];
        this.sceneObject.sceneNode.translate[2] += v[2];

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
