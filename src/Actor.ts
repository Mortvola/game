import { Vec2, Vec4, mat4, quat, vec4 } from "wgpu-matrix";
import Mesh from "./Drawables/Mesh";
import { box } from "./Drawables/Shapes/box";
import SceneNode from "./Drawables/SceneNode";
import { degToRad } from "./Math";
import Circle from "./Drawables/Circle";

class Actor {
  moveTo: Vec2 | null = null;

  hitPoints = 100;

  metersPerSecond = 2;

  actionsLeft = 0;

  distanceLeft = 0;

  mesh: SceneNode;

  circle: SceneNode;

  private constructor(mesh: SceneNode, color: Vec4) {
    this.mesh = mesh;

    const q = quat.fromEuler(degToRad(270), 0, 0, "xyz");

    this.circle = new Circle(4, 0.1, color);
    this.circle.postTransforms.push(mat4.fromQuat(q));
  }

  static async create(color: Vec4, teamColor: Vec4, launcherHeight: number) {
    const playerWidth = 4;

    const mesh = await Mesh.create(box(playerWidth, launcherHeight, playerWidth, color))
    mesh.translate[1] = launcherHeight / 2;  

    return new Actor(mesh, teamColor);
  }

  getWorldPosition() {
    // Transforms the position to world space.
    return vec4.transformMat4(
      vec4.create(0, 0, 0, 1),
      this.mesh.transform,
    );    
  }

  startTurn() {
    this.actionsLeft = 1;

    this.distanceLeft = this.metersPerSecond * 10;
  }
}

export default Actor;

