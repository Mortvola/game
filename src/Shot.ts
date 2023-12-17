import { Vec2, Vec3, Vec4, vec4 } from "wgpu-matrix";
import Actor from "./Character/Actor";
import { gravity } from "./Math";
import RenderPass from "./RenderPass";
import Mesh from "./Drawables/Mesh";
import { ActorInterface, ActorOnFinishCallback } from "./ActorInterface";
import { WorldInterface } from "./WorldInterface";

export type ShotData = {
  velocityVector: Vec2,
  startTime: number | null,
  startPos: Vec3,
  position: Vec4,
  orientation: Vec4,
};

class Shot implements ActorInterface {
  onFinish: ActorOnFinishCallback;

  startTime: number;

  mesh: Mesh;

  data: ShotData;

  actor: Actor;

  renderPass: RenderPass | null = null;

  constructor(
    startTime: number,
    onFinish: ActorOnFinishCallback,
    mesh: Mesh,
    actor: Actor,
    data: ShotData,
  ) {
    this.startTime = startTime;
    this.onFinish = onFinish
    this.mesh = mesh;
    this.actor = actor;
    this.data = data;
  }

  update(elapsedTime: number, timestamp: number, world: WorldInterface): ActorInterface[] {
    const removedActors: ActorInterface[] = [];

    if (this.startTime === null) {
      this.startTime = timestamp;
    } else {
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

      if (result) {
        removedActors.push(this);
        this.removeFromScene();
        this.onFinish(timestamp)

        return removedActors;
      }
      
      if (newPosition[1] < 0) {
        removedActors.push(this);
        this.removeFromScene();
        this.onFinish(timestamp)
        return removedActors;
      }

      this.data.position = newPosition;

      world.shot.translate[0] = this.data.position[0];
      world.shot.translate[1] = this.data.position[1];
      world.shot.translate[2] = this.data.position[2];
    }

    return removedActors;
  }

  addToScene(renderPass: RenderPass) {
    this.renderPass = renderPass;
    this.renderPass.addDrawable(this.mesh, 'lit');
  }

  removeFromScene() {
    if (this.renderPass) {
      this.renderPass.removeDrawable(this.mesh, 'lit');
    }
  }
}

export default Shot;
