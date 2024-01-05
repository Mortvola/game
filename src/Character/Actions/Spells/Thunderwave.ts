import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import Spell from "./Spell";

class Thunderwave extends Spell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Thunderwave', 'Action', 1, feetToMeters(15), 0, false, false);
  }
}

export default Thunderwave;
