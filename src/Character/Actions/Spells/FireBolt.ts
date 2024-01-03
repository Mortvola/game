import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class FireBolt extends Spell {
  constructor() {
    super('Fire Bolt', 'Action', 0, feetToMeters(120), 0, false);
  }
}

export default FireBolt;
