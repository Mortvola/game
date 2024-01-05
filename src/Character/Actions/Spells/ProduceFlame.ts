import Actor from "../../Actor";
import Spell from "./Spell";

class ProduceFlame extends Spell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Produce Flame', 'Action', 0, 0, 10 * 60, false, false);
  }
}

export default ProduceFlame;
