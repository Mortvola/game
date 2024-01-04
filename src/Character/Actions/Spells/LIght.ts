import Actor from "../../Actor";
import Spell from "./Spell";

class Light extends Spell {
  constructor(actor: Actor) {
    super(actor, 'Light', 'Action', 0, 0, 60 * 60, false)
  }
}

export default Light;
