import Script from "../../../Script/Script";
import { WorldInterface } from '../../../types'
import Actor from "../../Actor";
import TouchSpell from "./TouchSpell";

class Resistance extends TouchSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Resistance', 'Action', 0, 60, false, true)
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    this.targets[0].character.addInfluencingAction(this)

    if (world.loggerCallback) {
      world.loggerCallback(`${this.actor.character.name} cast ${this.name} on ${this.targets[0].character.name}.`)
    }

    return true;
  }
}

export default Resistance;
