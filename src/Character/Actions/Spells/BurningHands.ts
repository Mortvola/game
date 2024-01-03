import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class BurningHands extends Spell {
  constructor() {
    super('Burning Hands', 'Action', 1, feetToMeters(15), 0, false)
  }
}

export default BurningHands;
