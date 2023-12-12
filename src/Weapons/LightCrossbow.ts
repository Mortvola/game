import { diceRoll } from "../Dice";
import { RangedWeapon } from "./RangedWeapon";

class LightCrossbow implements RangedWeapon {
  cost = 25;

  get damage() {
    return diceRoll(8);
  }

  range = 80;

  longRange = 320;
}

export default LightCrossbow;
