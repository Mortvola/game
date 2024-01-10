import { vec4 } from "wgpu-matrix";
import Mesh from "./Drawables/Mesh";
import { box } from "./Drawables/Shapes/box";
import { feetToMeters } from "./Math";
import SceneNode from "./Drawables/SceneNode";
import DrawableNode from "./Drawables/DrawableNode";
import Drawable from "./Drawables/Drawable";

type Model = {
  name: string,
  mesh: Drawable,
}

class ModelManager {
  models: Model[] = []

  async getModel(name: string): Promise<SceneNode> {
    let model = this.models.find((m) => m.name === name);

    let node: SceneNode | null = null;

    switch (name) {
      case 'Human': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(5.75);
    
        if (!model) {
          const mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))
          model = { name, mesh };
          this.models.push(model)
        }

        node = new DrawableNode(model.mesh, 'lit');

        break;
      }

      case 'High Elf': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(5.75);

        if (!model) {
          const mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))
          model = { name, mesh };
          this.models.push(model)
        }

        node = new DrawableNode(model.mesh, 'lit');

        break;
      }

      case 'Wood Elf': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(4.5);
    
        if (!model) {
          const mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))
          model = { name, mesh };
          this.models.push(model)
        }

        node = new DrawableNode(model.mesh, 'lit');

        break;
      }

      case 'Hill Dwarf': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(4.5);
    
        if (!model) {
          const mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))
          model = { name, mesh };
          this.models.push(model)
        }

        node = new DrawableNode(model.mesh, 'lit');

        break;
      }

      case 'Mountain Dwarf': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(5.75);
    
        if (!model) {
          const mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))
          model = { name, mesh };
          this.models.push(model)
        }

        node = new DrawableNode(model.mesh, 'lit');

        break;
      }

      case 'Lightfoot Halfling': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(3);
    
        if (!model) {
          const mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))
          model = { name, mesh };
          this.models.push(model)
        }

        node = new DrawableNode(model.mesh, 'lit');

        break;
      }

      case  'Stout Halfling': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(3);
    
        if (!model) {
          const mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))
          model = { name, mesh };
          this.models.push(model)
        }

        node = new DrawableNode(model.mesh, 'lit');

        break;
      }

      case 'Goblin': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(3);
    
        if (!model) {
          const mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0.5, 0, 0, 1)))
          model = { name, mesh };
          this.models.push(model)
        }

        node = new DrawableNode(model.mesh, 'lit');

        break;
      }

      case 'Kobold':  {
        const playerWidth = 1;
        const playerHeight = feetToMeters(3);
    
        if (!model) {
          const mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0.5, 0, 0, 1)))
          model = { name, mesh };
          this.models.push(model)
        }

        node = new DrawableNode(model.mesh, 'lit');

        break;
      }

      case 'Shot': {
        if (!model) {
          const mesh = await Mesh.create(box(0.25, 0.25, 0.25, vec4.create(1, 1, 0, 1)));
          model = { name, mesh };
          this.models.push(model)
        }

        node = new DrawableNode(model.mesh, 'lit');

        break;
      }

      default:
        throw new Error(`model not found: ${name}`)
    }

    return node;
  }
}

export default ModelManager;
