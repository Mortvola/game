import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class Entangle extends Spell {
  constructor() {
    super('Entangle', 'Action', 1, feetToMeters(90), 60, true);
  }
}

export default Entangle;
