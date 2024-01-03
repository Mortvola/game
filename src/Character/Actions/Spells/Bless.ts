import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class Bless extends Spell {
  constructor() {
    super('Bless', 'Action', 1, feetToMeters(30), 60, true)
  }
}

export default Bless;
