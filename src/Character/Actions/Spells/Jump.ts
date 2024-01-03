import Spell from "./Spell";

class Jump extends Spell {
  constructor() {
    super('Jump', 'Action', 1, 0, 60, false);
  }
}

export default Jump;
