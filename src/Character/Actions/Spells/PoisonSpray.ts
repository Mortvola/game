import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class PoisonSpray extends Spell {
  constructor() {
    super('Poison Spray', 'Action', 0, feetToMeters(10), 0, false);
  }
}

export default PoisonSpray;
