import { Vec2, Vec4, mat4, quat, vec4 } from "wgpu-matrix";
import Mesh from "./Drawables/Mesh";
import { box } from "./Drawables/Shapes/box";
import SceneNode from "./Drawables/SceneNode";
import { degToRad } from "./Math";
import Circle from "./Drawables/Circle";
import { diceRoll } from "./Dice";

class Actor {
  name: string;

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

  strength: number;

  dexterity: number;

  constitution: number;
  
  intelligence: number;

  wisdom: number;

  charisma: number;

  initiativeRoll = 0;

  private constructor(name: string, mesh: SceneNode, height: number, color: Vec4) {
    this.name = name;
    this.mesh = mesh;
    this.height = height;
    this.shoulderHeight = height - 0.3;

    const q = quat.fromEuler(degToRad(270), 0, 0, "xyz");

    this.circle = new Circle(1, 0.1, color);
    this.circle.postTransforms.push(mat4.fromQuat(q));

    this.strength = this.abilityRoll();
    this.dexterity = this.abilityRoll();
    this.constitution = this.abilityRoll();
    this.intelligence = this.abilityRoll();
    this.wisdom = this.abilityRoll();
    this.charisma = this.abilityRoll();
  }

  static async create(name: string, color: Vec4, teamColor: Vec4) {
    const playerWidth = 1;
    const playerHeight = 1.75;

    const mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, color))
    mesh.translate[1] = playerHeight / 2;  

    return new Actor(name, mesh, playerHeight, teamColor);
  }

  abilityRoll(): number {
    const rolls = [
      diceRoll(6),
      diceRoll(6),
      diceRoll(6),
      diceRoll(6),
    ];

    rolls.sort((a: number, b: number) => b - a);

    return rolls[0] + rolls[1] + rolls[2];
  }

  abilityModifier(score: number): number {
    if (score === 1) {
      return -5
    }

    if (score === 30) {
      return 10;
    }

    return Math.trunc((score - 2) / 2 - 4);
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

