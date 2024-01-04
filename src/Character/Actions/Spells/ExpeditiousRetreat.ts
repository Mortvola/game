import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import SelfSpell from "./SelfSpell";
import ExpeditiousRetreatCondition from '../Conditions/ExpeditiousRetreat'

class ExpeditiousRetreat extends SelfSpell {
  constructor(actor: Actor) {
    super(actor, 'Expeditious Retreat', 'Bonus', 1, 0, 10 * 60, true)
  }

  cast(script: Script, world: WorldInterface) {
    this.actor.character.conditions.push(new ExpeditiousRetreatCondition())
  }
}

export default ExpeditiousRetreat;
