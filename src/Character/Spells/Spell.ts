import { feetToMeters } from "../../Math";

class Spell {
  name: string;

  castingTime = 1;

  range = feetToMeters(60);

  duration = 60;

  constructor(name: string) {
    this.name = name;
  }
}

export default Spell;
