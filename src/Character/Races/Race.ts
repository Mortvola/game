import { feetToMeters } from "../../Math";
import { AbilityScores } from "./AbilityScores";

export enum Size {
  Tiny = feetToMeters(2.5),
  Small = feetToMeters(5),
  Medium = feetToMeters(5),
  Large = feetToMeters(10),
  Huge = feetToMeters(15),
  Gargantuan = feetToMeters(20),
}

export interface Race {
  speed: number;

  abilityIncrease: AbilityScores;

  size: Size;
}
