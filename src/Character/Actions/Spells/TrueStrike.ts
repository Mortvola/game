import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class TrueStrike extends Spell {
  constructor() {
    super('True Strike', 'Action', 0, feetToMeters(30), 60, true);
  }
}

export default TrueStrike;
