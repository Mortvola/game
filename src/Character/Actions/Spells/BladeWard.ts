import Script from "../../../Script/Script";
import { CreatureActorInterface, WorldInterface } from "../../../types";
import SelfSpell from "./SelfSpell";

class BladeWard extends SelfSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Blade Ward', 'Action', 0, 6, true, false)
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    this.actor.character.addInfluencingAction(this)

    return true;
  }
}

export default BladeWard;
