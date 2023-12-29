import { feetToMeters } from "../../Math";
import Spell from "./Spell";

class MagicMissile extends Spell {
  castingTime = 1;

  range = feetToMeters(120);

  duration = 0;

  constructor() {
    super('Magic Missle')
  }
}

export default MagicMissile;
