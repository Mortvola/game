import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Warlock extends CharacterClass {
  constructor(level = 1) {
    super(level, 8, [Abilities.charisma], [Abilities.wisdom, Abilities.charisma])
  }
}

export default Warlock;
