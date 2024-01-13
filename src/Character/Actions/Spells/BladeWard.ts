import Script from "../../../Script/Script";
import { WorldInterface } from "../../../types";
import Actor from "../../Actor";
import SelfSpell from "./SelfSpell";

class BladeWard extends SelfSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Blade Ward', 'Action', 0, 6, true, false)
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    this.actor.character.addInfluencingAction(this)

    return true;
  }
}

export default BladeWard;
