import { diceRoll } from "../Dice";
import { RangedWeapon } from "./RangedWeapon";

class LongBow implements RangedWeapon {
  cost = 50;

  get damage() {
    return diceRoll(8);
  }

  range = 150;

  longRange = 600;
}

export default LongBow;