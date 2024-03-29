import { vec3, vec4 } from "wgpu-matrix";
import Mesh from "./Renderer/Drawables/Mesh";
import { box } from "./Renderer/Drawables/Shapes/box";
import DrawableNode from "./Renderer/Drawables/SceneNodes/DrawableNode";
import Drawable from "./Renderer/Drawables/Drawable";
import { downloadFbx } from "./Fbx/LoadFbx";
import ContainerNode from "./Renderer/Drawables/SceneNodes/ContainerNode";
import { gpu } from "./Renderer/Gpu";
import { FbxNodeInterface, isFbxContainerNode, isFbxGeometryNode } from "./Fbx/types";
import { DecalItem, GameObjectRecord, LightItem, ModelItem, ParticleItem, SceneNodeInterface } from "./Renderer/types";
import { MaterialDescriptor } from "./Renderer/Materials/MaterialDescriptor";
import { MaterialRecord, NodeMaterials } from "./game-common/types";
import Http from "./Http/src";
import { ShaderDescriptor } from "./Renderer/shaders/ShaderDescriptor";
import { particleSystemManager } from "./Renderer/ParticleSystemManager";
import SceneObject from "./SceneObject";
import { WorldInterface } from "./types";
import Light from "./Renderer/Drawables/Light";

class SceneObjectManager {
  meshes: Map<string, Drawable> = new Map();

  gameObjects: Map<string, GameObjectRecord> = new Map()

  async ready() {
    return gpu.ready();
  }

  async getSceneObject(name: string, world: WorldInterface): Promise<SceneObject> {
    if (this.gameObjects.size === 0) {
      const response = await Http.get<GameObjectRecord[]>('/game-objects-list');

      if (response.ok) {
        const gameObjects = await response.body();

        for (const object of gameObjects) {
          this.gameObjects.set(object.name, object)
        }
      }
    }

    let sceneObject: SceneObject | null = null;

    switch (name) {
      case 'Shot': {
        let mesh = this.meshes.get(name);

        if (!mesh) {
          mesh = await Mesh.create(box(0.25, 0.25, 0.25, vec4.create(1, 1, 0, 1)), 1);
          this.meshes.set(name, mesh)
        }

        const node = await DrawableNode.create(mesh);

        sceneObject = new SceneObject()
        sceneObject.sceneNode.addNode(node);

        break;
      }

      default: {
        const object = this.gameObjects.get(name);

        if (object) {
          sceneObject = await this.loadObject(object, world) ?? null;
        }

        break;
      }
    }

    if (!sceneObject) {
      throw new Error('node is null')
    }

    return sceneObject;
  }

  private async loadFbx(id: number): Promise<FbxNodeInterface | undefined> {
    let model: FbxNodeInterface | undefined = this.fbxModels.get(id.toString());

    if (!model) {
      model = await downloadFbx(`/models/${id}`)

      if (model) {
        this.fbxModels.set(id.toString(), model);
      }
    }

    return model;
  }

  private async loadObject(object: GameObjectRecord, world: WorldInterface): Promise<SceneObject | undefined> {
    const sceneObject = new SceneObject();

    for (const item of object.object.items) {
      if (item.type === 'model') {
        const fbxModel = await this.loadFbx((item.item as ModelItem).id);

        if (fbxModel) {
          let node = await this.parseFbxModel(fbxModel, object.name, (item.item as ModelItem).materials)
    
          if (node) {
            sceneObject.sceneNode.addNode(node);
          }
        }
      }
      else if (item.type === 'particle') {
        const particleSystem = await particleSystemManager.getParticleSystem((item.item as ParticleItem).id)

        if (particleSystem) {
          particleSystem.reset()
          sceneObject.particleSystems.push(particleSystem);
        }
      }
      else if (item.type === 'decal') {
        const decal = item.item as DecalItem;

        const drawable = await DrawableNode.create(
          await Mesh.create(box(1, 1, 1), 1),
          decal.materialId,
        )

        drawable.scale = vec3.create(decal.width ?? 1, 1, decal.height ?? 1)

        sceneObject.sceneNode.addNode(drawable)
      }
      else if (item.type === 'light') {
        const lightItem = item.item as LightItem

        const light = new Light()

        light.lightColor[0] = lightItem.color[0];
        light.lightColor[1] = lightItem.color[1];
        light.lightColor[2] = lightItem.color[2];
        light.lightColor[3] = lightItem.color[3];
        
        light.constant = lightItem.constant;
        light.linear = lightItem.linear;
        light.quadratic = lightItem.quadratic;
        
        sceneObject.sceneNode.addNode(light)    

      }
    }

    return sceneObject;
  }

  fbxModels: Map<string, FbxNodeInterface> = new Map();

  materialMap: Map<number, MaterialRecord> = new Map();

  materialDescrMap: Map<number, MaterialDescriptor> = new Map();

  shaderMap: Map<number, ShaderDescriptor> = new Map();

  private async parseFbxModel(
    node: FbxNodeInterface,
    name: string,
    nodeMaterials?: NodeMaterials,
  ): Promise<SceneNodeInterface | undefined> {
    if (isFbxContainerNode(node)) {
      const container = new ContainerNode();

      container.scale = node.scale.slice();
      container.translate = node.translate.slice();
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
        mesh = new Mesh(node.mesh, node.vertices, node.normals, node.texcoords, node.indices, 1);

        this.meshes.set(`${name}:${node.name}`, mesh)
      }

      let materialId: number | undefined = undefined

      if (nodeMaterials) {
        materialId = nodeMaterials[node.name]
      }

      const drawableNode = await DrawableNode.create(mesh, materialId);

      drawableNode.name = node.name;
      drawableNode.scale = node.scale.slice();
      drawableNode.translate = node.translate.slice();
      drawableNode.qRotate = node.qRotate.slice()
      drawableNode.angles = node.angles.slice()

      return drawableNode;
    }
  }

  private async getMaterial(id: number): Promise<MaterialDescriptor | undefined> {
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

export const sceneObjectlManager = new SceneObjectManager();

export default SceneObjectManager;
