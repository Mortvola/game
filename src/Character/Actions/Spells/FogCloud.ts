import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import Spell from "./Spell";

class FogCloud extends Spell {
  constructor(actor: Actor) {
    super(actor, 'Fog Cloud', 'Action', 1, feetToMeters(120), 60 * 60, true);
  }
}

export default FogCloud;
