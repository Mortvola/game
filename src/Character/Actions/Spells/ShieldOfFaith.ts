import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class ShieldOfFaith extends Spell {
  constructor() {
    super('Shield of Faith', 'Bonus', 1, feetToMeters(60), 10 * 60, true);
  }
}

export default ShieldOfFaith;
