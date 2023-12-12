import { Weapon } from "./Weapon";

export interface RangedWeapon extends Weapon {
  range: number;

  longRange: number;
}
