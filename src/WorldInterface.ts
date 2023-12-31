import { ActorInterface } from "./ActorInterface";
import Actor from "./Character/Actor";
import Collidees from "./Collidees";
import Circle from "./Drawables/Circle";
import ContainerNode from "./Drawables/ContainerNode";
import Line from "./Drawables/Line";
import Mesh from "./Drawables/Mesh";
import Participants from "./Participants";
import RenderPass from "./RenderPass";
import { Occupant } from "./Workers/PathPlannerQueue";

export type ActionInfo = {
  action: string,
  description?: string,
  percentSuccess: number | null,
}

export type FocusInfo = {
  name: string,
  hitpoints: number,
  temporaryHitpoints: number,
  maxHitpoints: number,
  armorClass: number,
  conditions: { name: string, duration: number }[],
}

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
  
  endTurn2(actor: ActorInterface): void;

  removeActors: ActorInterface[];

  mainRenderPass: RenderPass;

  loggerCallback: ((message: string) => void) | null;

  path2: Line | null;

  path3: Line | null;

  path4: Line | null;

  occupants: Occupant[];

  circleAoE: Circle | null;

  focused: Actor | null;

  focusCallback: ((focusInfo: FocusInfo | null) => void) | null;

  actionInfoCallback: ((actionInfo: ActionInfo | null) => void) | null;
}
