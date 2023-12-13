import { diceRoll } from "../Dice";
import RangedWeapon from "./RangedWeapon";

class HeavyCrossbow extends RangedWeapon {
  cost = 50;

  constructor() {
    super(100, 400);
  }

  damageRoll() {
    return diceRoll(10);
  }
}

export default HeavyCrossbow;
