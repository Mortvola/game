import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Paladin extends CharacterClass {
  constructor(level = 1) {
    super(level, 10, [Abilities.strength, Abilities.charisma], [Abilities.wisdom, Abilities.charisma])
  }
}

export default Paladin;
