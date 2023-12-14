import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Ranger extends CharacterClass {
  constructor(level = 1) {
    super('Ranger', level, 10, [Abilities.dexterity, Abilities.wisdom], [Abilities.strength, Abilities.dexterity])
  }

  clone(): Ranger {
    return new Ranger();
  }
}

export default Ranger;
