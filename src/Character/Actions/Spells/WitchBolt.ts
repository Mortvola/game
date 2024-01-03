import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class WitchBolt extends Spell {
  constructor() {
    super('Witch Bolt', 'Action', 1, feetToMeters(30), 60, true);
  }
}

export default WitchBolt;
