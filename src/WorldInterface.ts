import { ActorInterface } from "./ActorInterface";
import Collidees from "./Collidees";
import Mesh from "./Drawables/Mesh";
import Participants from "./Participants";

export type Delay = {
  startTime: number,
  duration: number,
  onFinish: ((timestamp: number) => void) | null,
}

export interface WorldInterface {
  collidees: Collidees;

  actors: ActorInterface[];

  participants: Participants;

  shot: Mesh;

  delays: Delay[];

  endTurn2(timestamp: number): void;
}