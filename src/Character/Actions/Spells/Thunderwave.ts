import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import Spell from "./Spell";

class Thunderwave extends Spell {
  constructor(actor: Actor) {
    super(actor, 'Thunderwave', 'Action', 1, feetToMeters(15), 0, false);
  }
}

export default Thunderwave;
