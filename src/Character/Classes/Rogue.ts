import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Rogue extends CharacterClass {
  constructor(level = 1) {
    super('Rogue', level, 8, [Abilities.dexterity], [Abilities.dexterity, Abilities.intelligence])
  }

  clone(): Rogue {
    return new Rogue();
  }
}

export default Rogue;
