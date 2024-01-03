import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class ThornWhip extends Spell {
  constructor() {
    super('Thorn Whip', 'Action', 0, feetToMeters(30), 0, false);
  }
}

export default ThornWhip;
