import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Paladin extends CharacterClass {
  constructor(level = 1) {
    super('Paladin', level, 10, [Abilities.strength, Abilities.charisma], [Abilities.wisdom, Abilities.charisma])
  }

  clone(): Paladin {
    return new Paladin();
  }
}

export default Paladin;
