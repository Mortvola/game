import { feetToMeters } from "../../../Renderer/Math";
import { CreatureActorInterface } from "../../../types";
import AreaSpell from "./AreaSpell";

class Thunderwave extends AreaSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 'Thunderwave', 'Action', 1, feetToMeters(15), feetToMeters(15), 0, false, false);
  }
}

export default Thunderwave;
