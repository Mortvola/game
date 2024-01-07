import { Vec2 } from "wgpu-matrix"

type OccupantType = 'Creature' | 'Terrain';

export type Occupant = {
  id: number,
  center: Vec2,
  radius: number,
  type: OccupantType,
  name: string,
}

export type MessageType = {
  type: 'PopulateGrid' | 'FindPath' | 'AddOccupant',
  id: number,
}

export type PopulateGridRequest = MessageType & {
  occupants: Occupant[],
}

export type AddOccupantdRequest = MessageType & {
  occupant: Occupant,
}

export type FindPathRequest = MessageType & {
  start: Vec2,
  goal: Vec2,
  goalRadius: number | null,
  target: { id: number } | null,
  maxDistance: number,
}

export type FindPathResponse = MessageType & {
  path: Vec2[],
  distance: number,
  lines: number[][],
  dbl: number[][],
}

export type PopulateGridResponse = MessageType & {
  lines: number[][]
}

export type AddOccupantResponse = MessageType & {
  
}


