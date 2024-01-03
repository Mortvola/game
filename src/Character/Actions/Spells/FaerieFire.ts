import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class FaerieFire extends Spell {
  constructor() {
    super('Faeie Fire', 'Action', 1, feetToMeters(60), 60, true);
  }
}

export default FaerieFire;
