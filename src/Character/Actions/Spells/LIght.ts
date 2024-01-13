import { CreatureActorInterface } from "../../../types";
import Spell from "./Spell";

class Light extends Spell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Light', 'Action', 0, 60 * 60, false, false)
  }
}

export default Light;
