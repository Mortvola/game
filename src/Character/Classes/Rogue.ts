import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Rogue extends CharacterClass {
  constructor(level = 1) {
    super(level, 8, [Abilities.dexterity], [Abilities.dexterity, Abilities.intelligence])
  }
}

export default Rogue;
