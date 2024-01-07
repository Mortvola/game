import { Occupant } from "../Workers/PathPlannerTypes";

export type GridNode = {
  x: number,
  y: number,
  gCost: number,
  hCost: number,
  occupants: Occupant[],
  parent: GridNode | null,
}
