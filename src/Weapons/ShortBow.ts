import { diceRoll } from "../Dice";
import { RangedWeapon } from "./RangedWeapon";

class ShortBow implements RangedWeapon {
  cost = 25;

  get damage() {
    return diceRoll(6);
  }

  range = 80;

  longRange = 320;
}

export default ShortBow;
