import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Cleric extends CharacterClass {
  constructor(level = 1) {
    super('Cleric', level, 8, [Abilities.wisdom], [Abilities.wisdom, Abilities.charisma])
  }

  clone(): Cleric {
    return new Cleric();
  }
}

export default Cleric;
