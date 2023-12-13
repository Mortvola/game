import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Ranger extends CharacterClass {
  constructor(level = 1) {
    super(level, 10, [Abilities.dexterity, Abilities.wisdom], [Abilities.strength, Abilities.dexterity])
  }
}

export default Ranger;
