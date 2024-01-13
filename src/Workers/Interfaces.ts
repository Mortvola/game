import { CharacterInterface } from "../types";

export interface EnvironmentInterface {
  teams: ActorInterface[][];

}

export interface ActorInterface {
  character: CharacterInterface;

  team: number;
}