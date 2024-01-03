import Spell from "./Spell";

class Longstrider extends Spell {
  constructor() {
    super('Longstrider', 'Action', 1, 0, 60 * 60, false);
  }
}

export default Longstrider;
