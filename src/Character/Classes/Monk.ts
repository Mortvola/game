import { Abilities, abilityModifier } from "../../Dice";
import { AbilityScores } from "../Races/AbilityScores";
import CharacterClass from "./CharacterClass";

class Monk extends CharacterClass {
  constructor(level = 1) {
    super('Monk', level, 8, [Abilities.dexterity, Abilities.wisdom], [Abilities.strength, Abilities.dexterity])
  }

  unarmoredDefence(abilityScores: AbilityScores) {
    return 10 + abilityModifier(abilityScores.dexterity) + abilityModifier(abilityScores.wisdom)
  }

  clone(): Monk {
    return new Monk();
  }
}

export default Monk;
