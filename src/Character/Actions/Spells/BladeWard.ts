import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import SelfSpell from "./SelfSpell";

class BladeWard extends SelfSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Blade Ward', 'Action', 0, 0, 6, false)
  }

  cast(script: Script, world: WorldInterface) {
    this.actor.character.addInfluencingSpell(this)
  }
}

export default BladeWard;
