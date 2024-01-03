import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class GuidingBolt extends Spell {
  constructor() {
    super('Guiding Bolt', 'Action', 1, feetToMeters(120), 6, false)
  }
}

export default GuidingBolt;
