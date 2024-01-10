import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import RangeSpell from "./RangeSpell";

class ColorSpray extends RangeSpell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Color Spray', 'Action', 1, feetToMeters(15), 6, true, false)
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    // const [damage, critical] = spellAttackRoll(
    //   actor.character,
    //   this.targets[0].character,
    //   () => diceRoll(3, 8),
    //   'Neutral'
    // )

    // this.targets[0].takeDamage(damage, critical, actor, this.name, script);

    return true;
  }
}

export default ColorSpray;
