import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Fighter extends CharacterClass {
  constructor(level = 1) {
    super(level, 10, [Abilities.strength, Abilities.dexterity], [Abilities.strength, Abilities.constitution])
  }
}

export default Fighter;
