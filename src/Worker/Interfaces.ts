import Character from "../Character/Character";

export interface EnvironmentInterface {
  teams: ActorInterface[][];

}

export interface ActorInterface {
  character: Character;

  team: number;
}