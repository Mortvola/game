// Record of node names and assigned material id.
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
