import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import TouchSpell from "./TouchSpell";

class Jump extends TouchSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Jump', 'Action', 1, 0, 60, false);
  }

  cast(script: Script, world: WorldInterface) {
    this.target!.character.addInfluencingSpell(this);
  }
}

export default Jump;
