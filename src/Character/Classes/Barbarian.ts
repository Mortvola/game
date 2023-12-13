import { Abilities, abilityModifier } from "../../Dice";
import { AbilityScores } from "../Races/AbilityScores";
import CharacterClass from "./CharacterClass";

class Barbarian extends CharacterClass {
  constructor(level = 1) {
    super(level, 12, [Abilities.strength], [Abilities.strength, Abilities.constitution])
  }

  unarmoredDefence(abilityScores: AbilityScores) {
    return 10 + abilityModifier(abilityScores.dexterity) + abilityModifier(abilityScores.constitution)
  }
}

export default Barbarian;
