import { diceRoll } from "../Dice";
import RangedWeapon from "./RangedWeapon";

class LongBow extends RangedWeapon {
  cost = 50;

  constructor() {
    super(150, 600);
  }

  damageRoll() {
    return diceRoll(8);
  }
}

export default LongBow;
