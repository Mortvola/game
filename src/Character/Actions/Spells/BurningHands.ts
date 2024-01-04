import { feetToMeters } from "../../../Math";
import Actor from "../../Actor";
import Spell from "./Spell";

class BurningHands extends Spell {
  constructor(actor: Actor) {
    super(actor, 'Burning Hands', 'Action', 1, feetToMeters(15), 0, false)
  }
}

export default BurningHands;
