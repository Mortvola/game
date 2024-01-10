import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import AreaSpell from "./AreaSpell";

class Sleep extends AreaSpell {
  constructor(actor: Actor) {
    super(actor, 'Sleep', 'Action', 1, feetToMeters(20), feetToMeters(90), 60, false, false)
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    return true;
  }
}

export default Sleep;
