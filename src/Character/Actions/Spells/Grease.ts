import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { addOccupant } from "../../../Workers/PathPlannerQueue";
import { Occupant } from "../../../Workers/PathPlannerTypes";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import AreaSpell from "./AreaSpell";

class Grease extends AreaSpell {
  constructor(actor: Actor) {
    super(actor, 'Grease', 'Action', 1, feetToMeters(10), feetToMeters(60), 60, false, false)
  }

  cast(script: Script, world: WorldInterface): boolean {
    const occupant: Occupant = {
      id: -1,
      center: this.center!,
      radius: this.radius,
      type: 'Terrain',
      name: 'Grease',
    };

    world.occupants.push(occupant)
    addOccupant(occupant)

    return true;
  }
}

export default Grease;
