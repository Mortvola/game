import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Warlock extends CharacterClass {
  constructor(level = 1) {
    super('Warlock', level, 8, [Abilities.charisma], [Abilities.wisdom, Abilities.charisma])
  }

  clone(): Warlock {
    return new Warlock();
  }
}

export default Warlock;
