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

  turnDuration = 6;

  height = 1.75;

  shoulderHeight = 1.45;

  mesh: SceneNode;

  circle: SceneNode;

  private constructor(mesh: SceneNode, height: number, color: Vec4) {
    this.mesh = mesh;
    this.height = height;
    this.shoulderHeight = height - 0.3;

    const q = quat.fromEuler(degToRad(270), 0, 0, "xyz");

    this.circle = new Circle(1, 0.1, color);
    this.circle.postTransforms.push(mat4.fromQuat(q));
  }

  static async create(color: Vec4, teamColor: Vec4) {
    const playerWidth = 1;
    const playerHeight = 1.75;

    const mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, color))
    mesh.translate[1] = playerHeight / 2;  

    return new Actor(mesh, playerHeight, teamColor);
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

    this.distanceLeft = this.metersPerSecond * this.turnDuration;
  }
}

export default Actor;

