import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Bard extends CharacterClass {
  constructor(level = 1) {
    super('Bard', level, 8, [Abilities.charisma], [Abilities.dexterity, Abilities.charisma])
  }

  clone(): Bard {
    return new Bard();
  }
}

export default Bard;
