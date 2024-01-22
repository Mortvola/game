import { feetToMeters } from "../../../Renderer/Math";
import { CreatureActorInterface } from "../../../types";
import AreaSpell from "./AreaSpell";

class BurningHands extends AreaSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 'Burning Hands', 'Action', 1, feetToMeters(15), 0, 0, false, false)
  }
}

export default BurningHands;
