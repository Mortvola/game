import { vec4 } from "wgpu-matrix";
import Mesh from "./Drawables/Mesh";
import { box } from "./Drawables/Shapes/box";
import { feetToMeters } from "./Math";

type Model = {
  name: string,
  mesh: Mesh,
}

class ModelManager {
  models: Model[] = []

  async getModel(name: string) {
    let model = this.models.find((m) => m.name === name);

    if (model) {
      return model.mesh;
    }

    let mesh: Mesh | null = null;

    switch (name) {
      case 'Human': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(5.75);
    
        mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))

        break;
      }

      case 'High Elf': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(5.75);
    
        mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))

        break;
      }

      case 'Wood Elf': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(4.5);
    
        mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))

        break;
      }

      case 'Hill Dwarf': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(4.5);
    
        mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))

        break;
      }

      case 'Mountain Dwarf': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(5.75);
    
        mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))

        break;
      }

      case 'Lightfoot Halfling': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(3);
    
        mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))

        break;
      }

      case  'Stout Halfling': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(3);
    
        mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))

        break;
      }

      case 'Goblin': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(3);
    
        mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0.5, 0, 0, 1)))

        break;
      }

      case 'Kobold':  {
        const playerWidth = 1;
        const playerHeight = feetToMeters(3);
    
        mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0.5, 0, 0, 1)))

        break;
      }

      default:
        throw new Error(`model not found: ${name}`)
    }

    if (mesh) {
      this.models.push({ name, mesh })
    }

    return mesh;
  }
}

export default ModelManager;
