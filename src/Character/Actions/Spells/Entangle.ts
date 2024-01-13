import { feetToMeters } from "../../../Math";
import { CreatureActorInterface } from "../../../types";
import AreaSpell from "./AreaSpell";

class Entangle extends AreaSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 'Entangle', 'Action', 1, feetToMeters(20), feetToMeters(90), 60, false, true);
  }
}

export default Entangle;
