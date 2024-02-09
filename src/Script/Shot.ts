import { vec4 } from "wgpu-matrix";
import { gravity } from "../Renderer/Math";
import { ActorInterface, SceneObjectInterface, ShotData, WorldInterface } from "../types";
import { SceneNodeInterface } from "../Renderer/types";

class Shot implements ActorInterface {
  startTime: number | null = null;

  sceneObject: SceneObjectInterface;

  data: ShotData;

  actor: ActorInterface;

  world: WorldInterface;

  constructor(
    sceneObject: SceneObjectInterface,
    actor: ActorInterface,
    data: ShotData,
    world: WorldInterface,
  ) {
    this.sceneObject = sceneObject;
    this.actor = actor;
    this.data = data;
    this.world = world;
  }

  async update(elapsedTime: number, timestamp: number): Promise<boolean> {
    if (this.startTime === null) {
      this.startTime = timestamp;
      this.addToScene();
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

      const result = this.world.collidees.detectCollision(this.data.position, newPosition, (actor: ActorInterface) => actor !== this.actor);

      if (result || newPosition[1] < 0 || xPos >= this.data.distance) {
        this.removeFromScene();
        return true;
      }
      
      this.data.position = newPosition;

      this.sceneObject.sceneNode.translate[0] = this.data.position[0];
      this.sceneObject.sceneNode.translate[1] = this.data.position[1];
      this.sceneObject.sceneNode.translate[2] = this.data.position[2];
    }

    return false;
  }

  addToScene() {
    this.world.renderer.scene.addNode(this.sceneObject.sceneNode);
  }

  removeFromScene() {
    this.world.renderer.scene.removeNode(this.sceneObject.sceneNode);
  }
}

export default Shot;
