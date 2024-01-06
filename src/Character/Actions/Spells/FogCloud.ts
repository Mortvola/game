import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import AreaSpell from "./AreaSpell";

class FogCloud extends AreaSpell {
  constructor(actor: Actor) {
    super(actor, 'Fog Cloud', 'Action', 1, feetToMeters(20), feetToMeters(120), 60 * 60, false, true);
  }
}

export default FogCloud;
