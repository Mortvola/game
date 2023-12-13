import { diceRoll } from "../Dice";
import RangedWeapon from "./RangedWeapon";

class LightCrossbow extends RangedWeapon {
  cost = 25;

  constructor() {
    super(80, 320);
  }

  damageRoll() {
    return diceRoll(8);
  }
}

export default LightCrossbow;
