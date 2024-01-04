import Creature from "../../Creature";
import Condition from "./Condition";

class TrueStrike extends Condition {
  charmer: Creature;

  constructor(charmer: Creature) {
    super('True Strike', 60)

    this.charmer = charmer;
  }
}

export default TrueStrike;
