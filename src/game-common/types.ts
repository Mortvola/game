import { PropertyInterface } from "../Renderer/ShaderBuilder/Types";

// Record of node names and assigned material id.
export type MaterialRecord = {
  id: number,
  name: string,
  shaderId: number,
  properties: PropertyInterface[],
}

export type NodeMaterials = Record<string, number>;

export type GameObject = {
  modelId: number,
  materials?: NodeMaterials,
}

export type GameObjectRecord = {
  id: number,
  name: string,
  object: GameObject,
}
