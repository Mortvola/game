import { feetToMeters } from "../../Math";
import { AbilityScores } from "../../types";

export enum Size {
  Tiny = feetToMeters(2.5),
  Small = feetToMeters(5),
  Medium = feetToMeters(5),
  Large = feetToMeters(10),
  Huge = feetToMeters(15),
  Gargantuan = feetToMeters(20),
}

export interface Race {
  name: string;
  
  speed: number;

  abilityIncrease: AbilityScores;

  hitPointBonus: number;
  
  size: Size;

  height: number;

  generateName(): string;

  clone(): Race;
}
