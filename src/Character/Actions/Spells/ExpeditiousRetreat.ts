import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import SelfSpell from "./SelfSpell";
import ExpeditiousRetreatCondition from '../Conditions/ExpeditiousRetreat'

class ExpeditiousRetreat extends SelfSpell {
  constructor() {
    super('Expeditious Retreat', 'Bonus', 1, 0, 10 * 60, true)
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    actor.character.conditions.push(new ExpeditiousRetreatCondition())
  }
}

export default ExpeditiousRetreat;
