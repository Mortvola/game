import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import { diceRoll } from "../../../Dice";
import RangeSpell from "./RangeSpell";

class MagicMissile extends RangeSpell {
  constructor() {
    super(3, false, 'Magic Missile', 'Action', 1, feetToMeters(120), 0, false)
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    for (const target of this.targets) {
      target.takeDamage(diceRoll(1, 4) + 1, false, actor, 'Magic Missle', script)
    }
  }
}

export default MagicMissile;
