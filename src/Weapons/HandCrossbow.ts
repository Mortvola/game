import { diceRoll } from "../Dice";
import { RangedWeapon } from "./RangedWeapon";

class HandCrossbow implements RangedWeapon {
  cost = 75;

  get damage() {
    return diceRoll(6);
  }

  range = 30;

  longRange = 120;
}

export default HandCrossbow;
