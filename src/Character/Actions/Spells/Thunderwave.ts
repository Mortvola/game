import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import AreaSpell from "./AreaSpell";

class Thunderwave extends AreaSpell {
  constructor(actor: Actor) {
    super(actor, 'Thunderwave', 'Action', 1, feetToMeters(15), feetToMeters(15), 0, false, false);
  }
}

export default Thunderwave;
