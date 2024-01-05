import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import Spell from "./Spell";

class BurningHands extends Spell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Burning Hands', 'Action', 1, feetToMeters(15), 0, false, false)
  }
}

export default BurningHands;
