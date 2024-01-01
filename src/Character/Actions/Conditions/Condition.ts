import { abilityModifier } from "../../../Dice";

class Condition {
  name: string;

  duration: number;

  constructor(name: string, duration: number) {
    this.name = name;
    this.duration = duration;
  }
}

export default Condition;
