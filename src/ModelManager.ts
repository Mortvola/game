import { vec4 } from "wgpu-matrix";
import Mesh from "./Renderer/Drawables/Mesh";
import { box } from "./Renderer/Drawables/Shapes/box";
import { feetToMeters } from "./Renderer/Math";
import DrawableNode from "./Renderer/Drawables/SceneNodes/DrawableNode";
import Drawable from "./Renderer/Drawables/Drawable";
import { downloadFbx } from "./Fbx/LoadFbx";
import ContainerNode from "./Renderer/Drawables/SceneNodes/ContainerNode";
import { litMaterial } from "./Renderer/Materials/Lit";
import { gpu } from "./Renderer/Gpu";
import { soulerCoasterMaterial } from "./Renderer/Materials/SoulerCoaster";
import { goblinMaterial } from "./Renderer/Materials/Goblin";
import { koboldMaterial } from "./Renderer/Materials/Kobold";
import { FbxNodeInterface, isFbxContainerNode, isFbxGeometryNode } from "./Fbx/types";
import { SceneNodeInterface } from "./Renderer/types";
import { MaterialDescriptor } from "./Renderer/Materials/MaterialDescriptor";
import { GameObjectRecord } from "./game-common/types";

class ModelManager {
  meshes: Map<string, Drawable> = new Map();

  gameObjects: GameObjectRecord[] = [];

  async ready() {
    return gpu.ready();
  }

  async getModel(name: string): Promise<SceneNodeInterface> {
    let mesh = this.meshes.get(name);

    let node: SceneNodeInterface | null = null;

    switch (name) {
      case 'Human': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(5.75);
    
        if (!mesh) {
          mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))
          this.meshes.set(name, mesh)
        }

        node = await DrawableNode.create(mesh, litMaterial);
        node.translate[1] = playerHeight / 2;  

        break;
      }

      case 'High Elf': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(5.75);

        if (!mesh) {
          mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))
          this.meshes.set(name, mesh);
        }

        node = await DrawableNode.create(mesh, litMaterial);
        node.translate[1] = playerHeight / 2;  

        break;
      }

      case 'Wood Elf': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(4.5);
    
        if (!mesh) {
          mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))
          this.meshes.set(name, mesh);
        }

        node = await DrawableNode.create(mesh, litMaterial);
        node.translate[1] = playerHeight / 2;  

        break;
      }

      case 'Hill Dwarf': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(4.5);
    
        if (!mesh) {
          mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))
          this.meshes.set(name, mesh)
        }

        node = await DrawableNode.create(mesh, litMaterial);
        node.translate[1] = playerHeight / 2;  

        break;
      }

      case 'Mountain Dwarf': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(5.75);
    
        if (!mesh) {
          mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))
          this.meshes.set(name, mesh)
        }

        node = await DrawableNode.create(mesh, litMaterial);
        node.translate[1] = playerHeight / 2;  

        break;
      }

      case 'Lightfoot Halfling': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(3);
    
        if (!mesh) {
          mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))
          this.meshes.set(name, mesh)
        }

        node = await DrawableNode.create(mesh, litMaterial);
        node.translate[1] = playerHeight / 2;  

        break;
      }

      case  'Stout Halfling': {
        const playerWidth = 1;
        const playerHeight = feetToMeters(3);
    
        if (!mesh) {
          mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0, 0, 0.5, 1)))
          this.meshes.set(name, mesh)
        }

        node = await DrawableNode.create(mesh, litMaterial);
        node.translate[1] = playerHeight / 2;  

        break;
      }

      case 'Goblin': {
        node = await this.loadFbx('./models/goblin.fbx', goblinMaterial)

        if (!mesh) {
          const playerWidth = 1;
          const playerHeight = feetToMeters(3);
      
          if (!mesh) {
            mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0.5, 0, 0, 1)))
            this.meshes.set(name, mesh)
          }

          node = await DrawableNode.create(mesh, goblinMaterial);
          node.translate[1] = playerHeight / 2;
        }

        break;
      }

      case 'Kobold':  {
        node = await this.loadFbx('./models/kobold.fbx', koboldMaterial)

        if (!node) {
          const playerWidth = 1;
          const playerHeight = feetToMeters(3);
      
          if (!mesh) {
            mesh = await Mesh.create(box(playerWidth, playerHeight, playerWidth, vec4.create(0.5, 0, 0, 1)))
            this.meshes.set(name, mesh)
          }

          node = await DrawableNode.create(mesh, koboldMaterial);
          node.translate[1] = playerHeight / 2;  
        }

        break;
      }

      case 'Shot': {
        if (!mesh) {
          mesh = await Mesh.create(box(0.25, 0.25, 0.25, vec4.create(1, 1, 0, 1)));
          this.meshes.set(name, mesh)
        }

        node = await DrawableNode.create(mesh, litMaterial);

        break;
      }

      case 'SoulerCoaster': {
        node = await this.loadFbx('./models/SoulerCoaster.fbx', soulerCoasterMaterial)

        if (!node) {
          if (!mesh) {
            mesh = await Mesh.create(box(0.25, 0.25, 0.25, vec4.create(1, 1, 0, 1)));
            this.meshes.set(name, mesh)
          }

          node = await DrawableNode.create(mesh, litMaterial);
        }

        break;
      }

      default:
        throw new Error(`model not found: ${name}`)
    }

    if (!node) {
      throw new Error('node is null')
    }

    return node;
  }

  fbxModels: Map<string, FbxNodeInterface> = new Map();

  async parseFbxModel(
    node: FbxNodeInterface,
    materialDescriptor: MaterialDescriptor,
    name: string,
  ): Promise<SceneNodeInterface | null> {
    if (isFbxContainerNode(node)) {
      const container = new ContainerNode();

      container.scale = node.scale;
      container.translate = node.translate;
      container.qRotate = node.qRotate;
      container.angles = node.angles.map((a) => a);

      for (const n of node.nodes) {
        const newNode = await this.parseFbxModel(n, materialDescriptor, name);

        if (newNode) {
          container.addNode(newNode);          
        }
      }

      if (container.nodes.length === 0) {
        return null;
      }

      // if (container.nodes.length === 1) {
      //   return container.nodes[0];
      // }

      return container;
    }

    if (isFbxGeometryNode(node)) {
      let mesh = this.meshes.get(`${name}:${node.name}`)

      if (!mesh) {
        mesh = new Mesh(node.mesh, node.vertices, node.normals, node.texcoords, node.indices);

        this.meshes.set(`${name}:${node.name}`, mesh)
      }

      const drawableNode = await DrawableNode.create(mesh, materialDescriptor);

      drawableNode.scale = node.scale;
      drawableNode.translate = node.translate;
      drawableNode.qRotate = node.qRotate;
      drawableNode.angles = node.angles.map((a) => a);

      return drawableNode;
    }

    return null;
  }

  async loadFbx(name: string, materialDescriptor: MaterialDescriptor): Promise<SceneNodeInterface | null> {
    let model = this.fbxModels.get(name);

    if (!model) {
      model = await downloadFbx(name)

      if (model) {
        this.fbxModels.set(name, model);
      }
    }

    if (model) {
      return this.parseFbxModel(model, materialDescriptor, name);
    }

    return null;
  }
}

export const modelManager = new ModelManager();

export default ModelManager;
