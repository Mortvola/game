import { Abilities } from "../../Dice";

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
}

export default CharacterClass;
