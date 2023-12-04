import { Vec2, Vec4, mat4, quat, vec4 } from "wgpu-matrix";
import Mesh from "./Drawables/Mesh";
import { box } from "./Drawables/Shapes/box";
import SceneNode from "./Drawables/SceneNode";
import { degToRad } from "./Math";
import Circle from "./Drawables/Circle";
import { abilityRoll } from "./Dice";

class Actor {
  name: string;

  team: number;

  automated: boolean;

  moveTo: Vec2 | null = null;

  hitPoints = 100;

  metersPerSecond = 2;

  actionsLeft = 0;

  distanceLeft = 0;

  turnDuration = 6;

  height = 1.75;

  chestHeight = 1.45;

  mesh: SceneNode;

  circle: Circle;

  teamColor: Vec4;

  strength: number;

  dexterity: number;

  constitution: number;
  
  intelligence: number;

  wisdom: number;

  charisma: number;

  initiativeRoll = 0;

  private constructor(name: string, mesh: SceneNode, height: number, color: Vec4, team: number, automated: boolean) {
    this.name = name;
    this.team = team;
    this.automated = automated;
    this.mesh = mesh;
    this.height = height;
    this.chestHeight = height - 0.5;
    this.teamColor = color;

    const q = quat.fromEuler(degToRad(270), 0, 0, "xyz");

    this.circle = new Circle(1, 0.025, color);
    this.circle.postTransforms.push(mat4.fromQuat(q));

    this.strength = abilityRoll();
    this.dexterity = abilityRoll();
    this.constitution = abilityRoll();
    this.intelligence = abilityRoll();
    this.wisdom = abilityRoll();
    this.charisma = abilityRoll();
  }

  static async create(name: string, color: Vec4, teamColor: Vec4, team: number, automated: boolean) {
    const playerWidth = 1;
    const playerHeight = 1.75;

    const mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, color))
    mesh.translate[1] = playerHeight / 2;  

    return new Actor(name, mesh, playerHeight, teamColor, team, automated);
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

    this.circle.color[0] = 1;
    this.circle.color[1] = 1;
    this.circle.color[2] = 1;
    this.circle.color[3] = 1;
  }

  endTurn() {
    this.circle.color[0] = this.teamColor[0];
    this.circle.color[1] = this.teamColor[1];
    this.circle.color[2] = this.teamColor[2];
    this.circle.color[3] = this.teamColor[3];
  }
}

export default Actor;

