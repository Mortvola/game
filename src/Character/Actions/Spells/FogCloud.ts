import { feetToMeters } from "../../../Math";
import { CreatureActorInterface } from "../../../types";
import AreaSpell from "./AreaSpell";

class FogCloud extends AreaSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 'Fog Cloud', 'Action', 1, feetToMeters(20), feetToMeters(120), 60 * 60, false, true);
  }
}

export default FogCloud;
