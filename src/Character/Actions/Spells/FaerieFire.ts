import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import AreaSpell from "./AreaSpell";

class FaerieFire extends AreaSpell {
  constructor(actor: Actor) {
    super(actor, 'Faeie Fire', 'Action', 1, feetToMeters(20), feetToMeters(60), 60, false, true);
  }
}

export default FaerieFire;
