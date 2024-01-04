import Actor from "../../Actor";
import Spell from "./Spell";

class ProduceFlame extends Spell {
  constructor(actor: Actor) {
    super(actor, 'Produce Flame', 'Action', 0, 0, 10 * 60, false);
  }
}

export default ProduceFlame;
