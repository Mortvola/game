import Actor from "../../Actor";
import Spell from "./Spell";

class Light extends Spell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Light', 'Action', 0, 0, 60 * 60, false, false)
  }
}

export default Light;
