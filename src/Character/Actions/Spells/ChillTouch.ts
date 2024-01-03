import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class ChillTouch extends Spell {
  constructor() {
    super('Chill Touch', 'Action', 0, feetToMeters(120), 6, false);
  }
}

export default ChillTouch;
