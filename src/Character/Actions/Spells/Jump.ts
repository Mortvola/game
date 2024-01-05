import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import TouchSpell from "./TouchSpell";

class Jump extends TouchSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Jump', 'Action', 1, 0, 60, false, false);
  }

  cast(script: Script, world: WorldInterface): boolean {
    this.targets[0].character.addInfluencingAction(this);

    return true;
  }
}

export default Jump;
