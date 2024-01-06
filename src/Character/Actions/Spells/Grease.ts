import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import AreaSpell from "./AreaSpell";

class Grease extends AreaSpell {
  constructor(actor: Actor) {
    super(actor, 'Grease', 'Action', 1, feetToMeters(10), feetToMeters(60), 60, false, false)
  }

  cast(script: Script, world: WorldInterface): boolean {
    world.occupants.push({ id: -1, center: this.center!, radius: this.radius })

    return true;
  }
}

export default Grease;
