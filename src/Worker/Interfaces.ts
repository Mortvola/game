export interface EnvironmentInterface {
  teams: ActorInterface[][];

}

export interface ActorInterface {
  hitPoints: number;

  team: number;
}