import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import RangeSpell from "./RangeSpell";
import ShieldOfFaithCondition from '../Conditions/SheldOfFaith';

class ShieldOfFaith extends RangeSpell {
  constructor() {
    super(1, true, 'Shield of Faith', 'Bonus', 1, feetToMeters(60), 10 * 60, true);
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    this.targets[0].character.conditions.push(new ShieldOfFaithCondition());

    actor.character.concentration = { name: this.name, targets: [this.targets[0].character] };
  }
}

export default ShieldOfFaith;
