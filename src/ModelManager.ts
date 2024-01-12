import { vec4 } from "wgpu-matrix";
import Mesh from "./Drawables/Mesh";
import { box } from "./Drawables/Shapes/box";
import { feetToMeters } from "./Math";
import SceneNode from "./Drawables/SceneNodes/SceneNode";
import DrawableNode from "./Drawables/SceneNodes/DrawableNode";
import Drawable from "./Drawables/Drawable";
import { downloadFbx } from "./Workers/LoadFbx";
import ContainerNode, { isContainerNode } from "./Drawables/SceneNodes/ContainerNode";
import { isGeometryNode } from "./Drawables/SceneNodes/GeometryNode";

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

        node = new DrawableNode(model.mesh, 'lit');
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

        node = new DrawableNode(model.mesh, 'lit');
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

        node = new DrawableNode(model.mesh, 'lit');
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

        node = new DrawableNode(model.mesh, 'lit');
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

        node = new DrawableNode(model.mesh, 'lit');
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

        node = new DrawableNode(model.mesh, 'lit');
        node.translate[1] = playerHeight / 2;  

        break;
      }

      case 'Goblin': {
        if (!model) {
          const mesh = await this.loadFbx('./models/goblin.fbx')

          if (mesh) {
            model = { name, mesh };
            this.models.push(model)
            node = new DrawableNode(model.mesh, 'lit');
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

          node = new DrawableNode(model.mesh, 'lit');
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
            node = new DrawableNode(model.mesh, 'lit');
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

          node = new DrawableNode(model.mesh, 'lit');
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

        node = new DrawableNode(model.mesh, 'lit');

        break;
      }

      case 'SoulerCoaster': {
        if (!model) {
          const mesh = await this.loadFbx('./models/SoulerCoaster.fbx')

          if (mesh) {
            model = { name, mesh };
            this.models.push(model)
            node = new DrawableNode(model.mesh, 'lit');
          }
        }

        if (!node) {
          if (!model) {
            const mesh = await Mesh.create(box(0.25, 0.25, 0.25, vec4.create(1, 1, 0, 1)));
            model = { name, mesh };
            this.models.push(model)
          }

          node = new DrawableNode(model.mesh, 'lit');
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
              const mesh = new Mesh(child.mesh, child.vertices, child.normals, child.indices);

              // For now, just return the first mesh found...
              return mesh;

              // const drawableNode = new DrawableNode(mesh, 'lit');

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
          const mesh = new Mesh(node.mesh, node.vertices, node.normals, node.indices);

          // For now, just return the first mesh found...
          return mesh;

          // const drawableNode = new DrawableNode(mesh, 'lit');

          // container.addNode(drawableNode);
        }
      }

      return null;
    }

    return null;
  }
}

export default ModelManager;
