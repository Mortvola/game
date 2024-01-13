import { feetToMeters } from "../../../Math";
import { CreatureActorInterface } from "../../../types";
import AreaSpell from "./AreaSpell";

class FaerieFire extends AreaSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 'Faeie Fire', 'Action', 1, feetToMeters(20), feetToMeters(60), 60, false, true);
  }
}

export default FaerieFire;
