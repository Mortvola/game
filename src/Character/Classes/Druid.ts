import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Druid extends CharacterClass {
  constructor(level = 1) {
    super('Druid', level, 8, [Abilities.wisdom], [Abilities.intelligence, Abilities.wisdom])
  }

  clone(): Druid {
    return new Druid();
  }
}

export default Druid;
