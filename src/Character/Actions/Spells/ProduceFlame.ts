import { CreatureActorInterface } from "../../../types";
import Spell from "./Spell";

class ProduceFlame extends Spell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Produce Flame', 'Action', 0, 10 * 60, false, false);
  }
}

export default ProduceFlame;
