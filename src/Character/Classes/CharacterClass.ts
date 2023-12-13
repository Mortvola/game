import { Abilities, abilityModifier } from "../../Dice";
import { AbilityScores } from "../Races/AbilityScores";

class CharacterClass {
  hitDice: number;

  level: number

  primaryAbilities: Abilities[];

  savingThrowsProficiencies: Abilities[];

  constructor(level: number, hitDice: number, primaryAbilities: Abilities[], savingThrowsProficiencies: Abilities[]) {
    this.hitDice = hitDice;
    this.level = level;
    this.primaryAbilities = primaryAbilities;
    this.savingThrowsProficiencies = savingThrowsProficiencies;
  }

  unarmoredDefence(abilityScores: AbilityScores) {
    return 10 + abilityModifier(abilityScores.dexterity)
  }
}

export default CharacterClass;
