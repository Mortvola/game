import Creature from "../../Creature";
import Condition from "./Condition";

class TashasHideosLaughter extends Condition {
  charmer: Creature;

  constructor(charmer: Creature) {
    super('TashasHideosLaughter', 60 * 60)

    this.charmer = charmer;
  }
}

export default TashasHideosLaughter;


