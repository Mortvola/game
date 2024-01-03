import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class SacredFlame extends Spell {
  constructor() {
    super('Sacred Flame', 'Action', 0, feetToMeters(60), 0, false);
  }
}

export default SacredFlame;
