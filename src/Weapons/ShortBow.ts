import { diceRoll } from "../Dice";
import RangedWeapon from "./RangedWeapon";

class ShortBow extends RangedWeapon {
  cost = 25;

  constructor() {
    super(80, 320)
  }

  damageRoll(): number {
    return diceRoll(6);
  }
}

export default ShortBow;
