import { vec3, vec4 } from "wgpu-matrix";
import Mesh from "./Renderer/Drawables/Mesh";
import { box } from "./Renderer/Drawables/Shapes/box";
import DrawableNode from "./Renderer/Drawables/SceneNodes/DrawableNode";
import Drawable from "./Renderer/Drawables/Drawable";
import { downloadFbx } from "./Fbx/LoadFbx";
import ContainerNode from "./Renderer/Drawables/SceneNodes/ContainerNode";
import { gpu } from "./Renderer/Gpu";
import { FbxNodeInterface, isFbxContainerNode, isFbxGeometryNode } from "./Fbx/types";
import { GameObjectRecord, ModelItem, SceneNodeInterface } from "./Renderer/types";
import { MaterialDescriptor } from "./Renderer/Materials/MaterialDescriptor";
import { MaterialRecord, NodeMaterials } from "./game-common/types";
import Http from "./Http/src";
import { ShaderDescriptor } from "./Renderer/shaders/ShaderDescriptor";

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
      case 'Shot': {
        if (!mesh) {
          mesh = await Mesh.create(box(0.25, 0.25, 0.25, vec4.create(1, 1, 0, 1)));
          this.meshes.set(name, mesh)
        }

        node = await DrawableNode.create(mesh);

        break;
      }

      default: {
        const object = this.gameObjects.find((o) => o.name === name);

        if (object) {
          node = await this.loadObject(object) ?? null;
        }

        break;
      }
    }

    if (!node) {
      throw new Error('node is null')
    }

    return node;
  }

  async loadFbx(id: number): Promise<FbxNodeInterface | undefined> {
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
    const container = new ContainerNode();

    for (const item of object.object.items) {
      if (item.type === 'model') {
        const fbxModel = await this.loadFbx(item.item.id);

        if (fbxModel) {
          let node = await this.parseFbxModel(fbxModel, object.name, (item.item as ModelItem).materials)
    
          if (node) {
            container.addNode(node);  
          }
        }
      }

      if (container.nodes.length > 0) {
        return container;
      }
    }
  }

  fbxModels: Map<string, FbxNodeInterface> = new Map();

  materialMap: Map<number, MaterialRecord> = new Map();

  materialDescrMap: Map<number, MaterialDescriptor> = new Map();

  shaderMap: Map<number, ShaderDescriptor> = new Map();

  async parseFbxModel(
    node: FbxNodeInterface,
    name: string,
    nodeMaterials?: NodeMaterials,
  ): Promise<SceneNodeInterface | undefined> {
    if (isFbxContainerNode(node)) {
      const container = new ContainerNode();

      container.scale = vec3.copy(node.scale);
      container.translate = vec3.copy(node.translate);
      container.qRotate = node.qRotate.slice()
      container.angles = node.angles.slice()

      for (const n of node.nodes) {
        const newNode = await this.parseFbxModel(n, name, nodeMaterials);

        if (newNode) {
          container.addNode(newNode);          
        }
      }

      if (container.nodes.length === 0) {
        return undefined;
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

      // if (!materialDescriptor) {
      //   materialDescriptor = litMaterial;
      // }  

      const drawableNode = await DrawableNode.create(mesh, materialDescriptor?.shaderDescriptor);

      drawableNode.name = node.name;
      drawableNode.scale = vec3.copy(node.scale);
      drawableNode.translate = vec3.copy(node.translate);
      drawableNode.qRotate = node.qRotate.slice()
      drawableNode.angles = node.angles.slice()

      return drawableNode;
    }
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
        let shaderDescr = this.shaderMap.get(materialRecord.shaderId);

        if (!shaderDescr) {
          const response = await Http.get<{ name: string, descriptor: ShaderDescriptor }>(`/shader-descriptors/${materialRecord.shaderId}`);

          if (response.ok) {
            const descr = await response.body();

            shaderDescr = descr.descriptor;

            this.shaderMap.set(id, shaderDescr);
          }
        }

        if (shaderDescr) {
          const material: MaterialDescriptor = {
            properties: [], // materialRecord.properties,
  
            shaderDescriptor: shaderDescr,
          }

          return material
        }
      }
    }
  }
}

export const modelManager = new ModelManager();

export default ModelManager;
