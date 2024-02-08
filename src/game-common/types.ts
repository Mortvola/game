import { PropertyInterface } from "../Renderer/ShaderBuilder/Types";

// Record of node names and assigned material id.
export type MaterialRecord = {
  id: number,
  name: string,
  shaderId: number,
  properties: PropertyInterface[],
}

export type NodeMaterials = Record<string, number>;
