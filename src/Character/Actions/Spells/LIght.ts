import Spell from "./Spell";

class Light extends Spell {
  constructor() {
    super('Light', 'Action', 0, 0, 60 * 60, false)
  }
}

export default Light;
