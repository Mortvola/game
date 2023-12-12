import { diceRoll } from "../Dice";
import { Weapon } from "./Weapon";

class LongBow implements Weapon {
  cost = 50;

  get damage() {
    return diceRoll(8);
  }
}

export default LongBow;
