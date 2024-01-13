import { Vec2, Vec3, Vec4, vec4 } from "wgpu-matrix";
import Actor from "../Character/Actor";
import { gravity } from "../Math";
import { ActorInterface, WorldInterface } from "../types";
import { SceneNodeInterface } from "../Drawables/SceneNodes/SceneNodeInterface";

export type ShotData = {
  velocityVector: Vec2,
  startPos: Vec3,
  position: Vec4,
  orientation: Vec4,
  distance: number,
  duration?: number,
};

class Shot implements ActorInterface {
  startTime: number | null = null;

  mesh: SceneNodeInterface;

  data: ShotData;

  actor: ActorInterface;

  constructor(
    mesh: SceneNodeInterface,
    actor: ActorInterface,
    data: ShotData,
  ) {
    this.mesh = mesh;
    this.actor = actor;
    this.data = data;
  }

  async update(elapsedTime: number, timestamp: number, world: WorldInterface): Promise<boolean> {
    if (this.startTime === null) {
      this.startTime = timestamp;
      this.addToScene(world);
    }
    else {
      const shotElapsedTime = (timestamp - this.startTime) * 0.001;

      const xPos = this.data.velocityVector[0] * shotElapsedTime;

      const xz = vec4.mulScalar(this.data.orientation, xPos);

      const newPosition = vec4.create(
        this.data.startPos[0] + xz[0],
        this.data.startPos[1] + this.data.velocityVector[1] * shotElapsedTime + 0.5 * gravity * shotElapsedTime * shotElapsedTime,
        this.data.startPos[2] + xz[2],
        1,
      );

      const result = world.collidees.detectCollision(this.data.position, newPosition, (actor: Actor) => actor !== this.actor);

      if (result || newPosition[1] < 0 || xPos >= this.data.distance) {
        this.removeFromScene(world);
        return true;
      }
      
      this.data.position = newPosition;

      this.mesh.translate[0] = this.data.position[0];
      this.mesh.translate[1] = this.data.position[1];
      this.mesh.translate[2] = this.data.position[2];
    }

    return false;
  }

  addToScene(world: WorldInterface) {
    world.scene.addNode(this.mesh);
  }

  removeFromScene(world: WorldInterface) {
    world.scene.removeNode(this.mesh);
  }
}

export default Shot;
