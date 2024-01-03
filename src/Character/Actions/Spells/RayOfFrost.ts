import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class RayOfFrost extends Spell {
  constructor() {
    super('Ray of Frost', 'Action', 0, feetToMeters(60), 0, false);
  }
}

export default RayOfFrost;
