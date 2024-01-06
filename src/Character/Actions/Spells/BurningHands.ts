import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import AreaSpell from "./AreaSpell";

class BurningHands extends AreaSpell {
  constructor(actor: Actor) {
    super(actor, 'Burning Hands', 'Action', 1, feetToMeters(15), 0, 0, false, false)
  }
}

export default BurningHands;
