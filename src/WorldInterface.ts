import { ActorInterface } from "./ActorInterface";
import Collidees from "./Collidees";
import ContainerNode from "./Drawables/ContainerNode";
import Mesh from "./Drawables/Mesh";
import Participants from "./Participants";
import RenderPass from "./RenderPass";

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

  scene: ContainerNode;

  animate: boolean;
  
  endTurn2(timestamp: number): void;

  removeActors: ActorInterface[];

  mainRenderPass: RenderPass;

  loggerCallback: ((message: string) => void) | null;
}
