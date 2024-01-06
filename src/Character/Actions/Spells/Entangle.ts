import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import AreaSpell from "./AreaSpell";

class Entangle extends AreaSpell {
  constructor(actor: Actor) {
    super(actor, 'Entangle', 'Action', 1, feetToMeters(20), feetToMeters(90), 60, false, true);
  }
}

export default Entangle;
