import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Wizard extends CharacterClass {
  constructor(level = 1) {
    super(level, 6, [Abilities.intelligence], [Abilities.intelligence, Abilities.wisdom])
  }
}

export default Wizard;
