import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class AcidSplash extends Spell {
  constructor() {
    super('Acid Splash', 'Action', 0, feetToMeters(60), 0, false)
  }
}

export default AcidSplash;
