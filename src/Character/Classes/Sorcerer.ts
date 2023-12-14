import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Sorcerer extends CharacterClass {
  constructor(level = 1) {
    super('Sorcerer', level, 6, [Abilities.charisma], [Abilities.constitution, Abilities.charisma])
  }

  clone(): Sorcerer {
    return new Sorcerer();
  }
}

export default Sorcerer;
