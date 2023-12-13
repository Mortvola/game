import { diceRoll } from "../Dice";
import RangedWeapon from "./RangedWeapon";

class HandCrossbow extends RangedWeapon {
  cost = 75;

  constructor() {
    super(30, 120);
  }

  damageRoll() {
    return diceRoll(6);
  }
}

export default HandCrossbow;
