import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import Spell from "./Spell";

class Entangle extends Spell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Entangle', 'Action', 1, feetToMeters(90), 60, false, true);
  }
}

export default Entangle;
