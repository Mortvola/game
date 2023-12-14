import { Abilities, abilityModifier } from "../../Dice";
import { AbilityScores } from "../Races/AbilityScores";

class CharacterClass {
  name: string;

  hitDice: number;

  level: number

  primaryAbilities: Abilities[];

  savingThrowsProficiencies: Abilities[];

  constructor(name: string, level: number, hitDice: number, primaryAbilities: Abilities[], savingThrowsProficiencies: Abilities[]) {
    this.name = name;
    this.hitDice = hitDice;
    this.level = level;
    this.primaryAbilities = primaryAbilities;
    this.savingThrowsProficiencies = savingThrowsProficiencies;
  }

  unarmoredDefence(abilityScores: AbilityScores) {
    return 10 + abilityModifier(abilityScores.dexterity)
  }

  clone(): CharacterClass {
    throw new Error('not implemented')
  }
}

export default CharacterClass;
