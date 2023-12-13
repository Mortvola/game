import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Barbarian extends CharacterClass {
  constructor(level = 1) {
    super(level, 12, [Abilities.strength], [Abilities.strength, Abilities.constitution])
  }
}

export default Barbarian;
