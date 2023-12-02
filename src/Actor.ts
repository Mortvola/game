import { Vec2, Vec4 } from "wgpu-matrix";
import Mesh from "./Drawables/Mesh";
import { box } from "./Drawables/Shapes/box";
import SceneNode from "./Drawables/SceneNode";

class Actor {
  moveTo: Vec2 | null = null;

  speed = 20;
  
  mesh: SceneNode;

  private constructor(mesh: SceneNode) {
    this.mesh = mesh;
  }

  static async create(color: Vec4, launcherHeight: number) {
    const playerWidth = 4;

    const mesh = await Mesh.create(box(playerWidth, launcherHeight, playerWidth, color))
    mesh.translate[1] = launcherHeight / 2;  

    return new Actor(mesh);
  }
}

export default Actor;

