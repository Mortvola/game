import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Sorcerer extends CharacterClass {
  constructor(level = 1) {
    super(level, 6, [Abilities.charisma], [Abilities.constitution, Abilities.charisma])
  }
}

export default Sorcerer;
