import { diceRoll } from "../Dice";
import { RangedWeapon } from "./RangedWeapon";

class HeavyCrossbow implements RangedWeapon {
  cost = 50;

  get damage() {
    return diceRoll(10);
  }

  range = 100;

  longRange = 400;
}

export default HeavyCrossbow;
