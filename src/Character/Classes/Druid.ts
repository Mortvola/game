import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Druid extends CharacterClass {
  constructor(level = 1) {
    super(level, 8, [Abilities.wisdom], [Abilities.intelligence, Abilities.wisdom])
  }
}

export default Druid;
