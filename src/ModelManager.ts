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
import { DrawableNodeInterface, MaterialInterface, SceneNodeInterface } from "./Renderer/types";
import { MaterialDescriptor } from "./Renderer/Materials/MaterialDescriptor";
import { GameObjectRecord, MaterialRecord, NodeMaterials } from "./game-common/types";
import Http from "./Http/src";
import Material from "./Renderer/Materials/Material";

class ModelManager {
  meshes: Map<string, Drawable> = new Map();

  gameObjects: GameObjectRecord[] = [];

  async ready() {
    return gpu.ready();
  }

  async getModel(name: string): Promise<SceneNodeInterface> {
    if (this.gameObjects.length === 0) {
      const response = await Http.get<GameObjectRecord[]>('/game-objects-list');

      if (response.ok) {
        this.gameObjects = await response.body();
      }
    }

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
        const object = this.gameObjects.find((o) => o.name === 'Goblin');

        if (object) {
          node = await this.loadObject(object) ?? null;
        }

        break;
      }

      case 'Kobold':  {
        const object = this.gameObjects.find((o) => o.name === 'kobold');

        if (object) {
          node = await this.loadObject(object) ?? null;
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
        const object = this.gameObjects.find((o) => o.name === 'SoulerCoaster');

        if (object) {
          node = await this.loadObject(object) ?? null;
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

  async loadFbx2(id: number): Promise<FbxNodeInterface | undefined> {
    let model: FbxNodeInterface | undefined = this.fbxModels.get(id.toString());

    if (!model) {
      model = await downloadFbx(`/models/${id}`)

      if (model) {
        this.fbxModels.set(id.toString(), model);
      }
    }

    return model;
  }

  async loadObject(object: GameObjectRecord): Promise<SceneNodeInterface | undefined> {
    const fbxModel = await this.loadFbx2(object.object.modelId);

    if (fbxModel) {
      return await this.parseFbxModel(fbxModel, object.name, object.object.materials) ?? undefined
    }
  }

  fbxModels: Map<string, FbxNodeInterface> = new Map();

  materialMap: Map<number, MaterialRecord> = new Map();

  materialDescrMap: Map<number, MaterialDescriptor> = new Map();

  shaderMap: Map<number, MaterialDescriptor> = new Map();

  async parseFbxModel(
    node: FbxNodeInterface,
    name: string,
    nodeMaterials?: NodeMaterials,
  ): Promise<SceneNodeInterface | null> {
    if (isFbxContainerNode(node)) {
      const container = new ContainerNode();

      container.scale = node.scale;
      container.translate = node.translate;
      container.qRotate = node.qRotate;
      container.angles = node.angles.map((a) => a);

      for (const n of node.nodes) {
        const newNode = await this.parseFbxModel(n, name, nodeMaterials);

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
      // Have we already created this mesh?
      let mesh = this.meshes.get(`${name}:${node.name}`)

      if (!mesh) {
        // No, create the mesh now.
        mesh = new Mesh(node.mesh, node.vertices, node.normals, node.texcoords, node.indices);

        this.meshes.set(`${name}:${node.name}`, mesh)
      }

      let materialDescriptor: MaterialDescriptor | undefined

      if (nodeMaterials) {
        const materialId = nodeMaterials[node.name]

        if (materialId !== undefined) {
          materialDescriptor = await this.getMaterial(materialId);
        }  
      }

      if (!materialDescriptor) {
        materialDescriptor = litMaterial;
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

  async getMaterial(id: number): Promise<MaterialDescriptor | undefined> {
    let material = this.materialDescrMap.get(id);

    if (!material) {
      let materialRecord = this.materialMap.get(id);

      if (!materialRecord) {
        const response = await Http.get<MaterialRecord>(`/materials/${id}`);

        if (response.ok) {
          materialRecord = await response.body();

          this.materialMap.set(id, materialRecord)
        }
      }

      if (materialRecord) {
        const shaderDescr = this.shaderMap.get(materialRecord.shaderId);

        if (!shaderDescr) {
          const response = await Http.get<{ name: string, descriptor: MaterialDescriptor }>(`/shader-descriptors/${materialRecord.shaderId}`);

          if (response.ok) {
            const descr = await response.body();

            material = descr.descriptor;

            this.materialDescrMap.set(id, material);
          }
        }
      }
    }

    return material;
  }
}

export const modelManager = new ModelManager();

export default ModelManager;
