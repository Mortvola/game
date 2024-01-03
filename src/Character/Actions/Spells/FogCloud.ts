import { feetToMeters } from "../../../Math";
import Spell from "./Spell";

class FogCloud extends Spell {
  constructor() {
    super('Fog Cloud', 'Action', 1, feetToMeters(120), 60 * 60, true);
  }
}

export default FogCloud;
