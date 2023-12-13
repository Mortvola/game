import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Monk extends CharacterClass {
  constructor(level = 1) {
    super(level, 8, [Abilities.dexterity, Abilities.wisdom], [Abilities.strength, Abilities.dexterity])
  }
}

export default Monk;
