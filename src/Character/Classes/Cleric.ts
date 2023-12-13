import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Cleric extends CharacterClass {
  constructor(level = 1) {
    super(level, 8, [Abilities.wisdom], [Abilities.wisdom, Abilities.charisma])
  }
}

export default Cleric;
