import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class Thunderwave extends Spell {
  constructor() {
    super('Thunderwave', 'Action', 1, feetToMeters(15), 0, false);
  }
}

export default Thunderwave;
