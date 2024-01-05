import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import Spell from "./Spell";

class FaerieFire extends Spell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Faeie Fire', 'Action', 1, feetToMeters(60), 60, false, true);
  }
}

export default FaerieFire;
