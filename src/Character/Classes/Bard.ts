import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Bard extends CharacterClass {
  constructor(level = 1) {
    super(level, 8, [Abilities.charisma], [Abilities.dexterity, Abilities.charisma])
  }
}

export default Bard;
