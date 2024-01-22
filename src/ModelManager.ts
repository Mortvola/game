import { vec4 } from "wgpu-matrix";
import Mesh from "./Renderer/Drawables/Mesh";
import { box } from "./Renderer/Drawables/Shapes/box";
import { feetToMeters } from "./Math";
import SceneNode from "./Renderer/Drawables/SceneNodes/SceneNode";
import DrawableNode from "./Renderer/Drawables/SceneNodes/DrawableNode";
import Drawable from "./Renderer/Drawables/Drawable";
import { downloadFbx } from "./Workers/LoadFbx";
import ContainerNode, { isContainerNode } from "./Renderer/Drawables/SceneNodes/ContainerNode";
import { isGeometryNode } from "./Renderer/Drawables/SceneNodes/GeometryNode";
import { litMaterial } from "./Renderer/Materials/Lit";
import { gpu } from "./Renderer/Gpu";
import { soulerCoasterMaterial } from "./Renderer/Materials/SoulerCoaster";
import { goblinMaterial } from "./Renderer/Materials/Goblin";
import { koboldMaterial } from "./Renderer/Materials/Kobold";

type Model = {
  name: string,
  mesh: Drawable,
}

class ModelManager {
  models: Model[] = []

  async ready() {
    return gpu.ready();
  }

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

        node = await DrawableNode.create(model.mesh, litMaterial);
        node.translate[1] = playerHeight / 2;  

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

        node = await DrawableNode.create(model.mesh, litMaterial);
        node.translate[1] = playerHeight / 2;  

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

        node = await DrawableNode.create(model.mesh, litMaterial);
        node.translate[1] = playerHeight / 2;  

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

        node = await DrawableNode.create(model.mesh, litMaterial);
        node.translate[1] = playerHeight / 2;  

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

        node = await DrawableNode.create(model.mesh, litMaterial);
        node.translate[1] = playerHeight / 2;  

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

        node = await DrawableNode.create(model.mesh, litMaterial);
        node.translate[1] = playerHeight / 2;  

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

        node = await DrawableNode.create(model.mesh, litMaterial);
        node.translate[1] = playerHeight / 2;  

        break;
      }

      case 'Goblin': {
        if (!model) {
          const mesh = await this.loadFbx('./models/goblin.fbx')

          if (mesh) {
            model = { name, mesh };
            this.models.push(model)
            node = await DrawableNode.create(model.mesh, goblinMaterial);
          }
        }

        if (!node) {
          const playerWidth = 1;
          const playerHeight = feetToMeters(3);
      
          if (!model) {
            const mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0.5, 0, 0, 1)))
            model = { name, mesh };
            this.models.push(model)
          }

          node = await DrawableNode.create(model.mesh, goblinMaterial);
          node.translate[1] = playerHeight / 2;
        }

        break;
      }

      case 'Kobold':  {
        if (!model) {
          const mesh = await this.loadFbx('./models/kobold.fbx')

          if (mesh) {
            model = { name, mesh };
            this.models.push(model)
            node = await DrawableNode.create(model.mesh, koboldMaterial);
          }
        }

        if (!node) {
          const playerWidth = 1;
          const playerHeight = feetToMeters(3);
      
          if (!model) {
            const mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0.5, 0, 0, 1)))
            model = { name, mesh };
            this.models.push(model)
          }

          node = await DrawableNode.create(model.mesh, koboldMaterial);
          node.translate[1] = playerHeight / 2;  
        }

        break;
      }

      case 'Shot': {
        if (!model) {
          const mesh = await Mesh.create(box(0.25, 0.25, 0.25, vec4.create(1, 1, 0, 1)));
          model = { name, mesh };
          this.models.push(model)
        }

        node = await DrawableNode.create(model.mesh, litMaterial);

        break;
      }

      case 'SoulerCoaster': {
        if (!model) {
          const mesh = await this.loadFbx('./models/SoulerCoaster.fbx')

          if (mesh) {
            model = { name, mesh };
            this.models.push(model)
            node = await DrawableNode.create(model.mesh, soulerCoasterMaterial);
          }
        }

        if (!node) {
          if (!model) {
            const mesh = await Mesh.create(box(0.25, 0.25, 0.25, vec4.create(1, 1, 0, 1)));
            model = { name, mesh };
            this.models.push(model)
          }

          node = await DrawableNode.create(model.mesh, litMaterial);
        }

        break;
      }

      default:
        throw new Error(`model not found: ${name}`)
    }

    return node;
  }

  async loadFbx(name: string): Promise<Mesh | null> {
    const result = await downloadFbx(name)

    if (result) {
      const container = new ContainerNode();

      for (const node of result) {
        if (isContainerNode(node)) {
          for (let i = 0; i < node.nodes.length; i += 1) {
            const child = node.nodes[i];

            if (isGeometryNode(child)) {
              const mesh = new Mesh(child.mesh, child.vertices, child.normals, child.texcoords, child.indices);

              // For now, just return the first mesh found...
              return mesh;

              // const drawableNode = await DrawableNode.create(mesh, 'lit');

              // node.nodes = [
              //   ...node.nodes.slice(0, i),
              //   drawableNode,
              //   ...node.nodes.slice(i + 1),
              // ]
            }
          }

          container.addNode(node);
        }
        else if (isGeometryNode(node)) {
          const mesh = new Mesh(node.mesh, node.vertices, node.normals, node.texcoords, node.indices);

          // For now, just return the first mesh found...
          return mesh;

          // const drawableNode = await DrawableNode.create(mesh, 'lit');

          // container.addNode(drawableNode);
        }
      }

      return null;
    }

    return null;
  }
}

export const modelManager = new ModelManager();

export default ModelManager;
