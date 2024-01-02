import Creature from "../../Creature";
import Condition from "./Condition";

class Charmed extends Condition {
  charmer: Creature;

  constructor(charmer: Creature) {
    super('Charmed', 60 * 60)

    this.charmer = charmer;
  }
}

export default Charmed;


