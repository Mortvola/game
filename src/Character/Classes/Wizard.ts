import { Abilities } from "../../Dice";
import CharacterClass from "./CharacterClass";

class Wizard extends CharacterClass {
  constructor(level = 1) {
    super('Wizard', level, 6, [Abilities.intelligence], [Abilities.intelligence, Abilities.wisdom])
  }

  clone(): Wizard {
    return new Wizard();
  }
}

export default Wizard;
