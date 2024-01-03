import Spell from "./Spell";

class ProduceFlame extends Spell {
  constructor() {
    super('Produce Flame', 'Action', 0, 0, 10 * 60, false);
  }
}

export default ProduceFlame;
