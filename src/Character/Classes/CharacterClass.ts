import { Abilities } from "./Abilities";
import { abilityModifier } from "../../Dice";
import { AbilityScores, ActionFactory, ActionInterface, CharacterClassInterface } from "../../types";
import { Armor } from "../Equipment/Armor";
import { Weapon, WeaponProficiencies, WeaponType } from "../Equipment/Types";

class CharacterClass implements CharacterClassInterface {
  name: string;

  hitDice: number;

  level: number

  primaryAbilities: Abilities[];

  savingThrowsProficiencies: Abilities[];

  weaponProficiencies: WeaponProficiencies[];

  actions: ActionFactory<ActionInterface>[];

  constructor(
    name: string,
    level: number,
    hitDice: number,
    primaryAbilities: Abilities[],
    savingThrowsProficiencies: Abilities[],
    weaponProficiencies: WeaponProficiencies[],
    actions?: ActionFactory<ActionInterface>[]
  ) {
    this.name = name;
    this.hitDice = hitDice;
    this.level = level;
    this.primaryAbilities = primaryAbilities;
    this.savingThrowsProficiencies = savingThrowsProficiencies;
    this.weaponProficiencies = weaponProficiencies;
    this.actions = actions ?? [];
  }

  unarmoredDefence(abilityScores: AbilityScores) {
    return 10 + abilityModifier(abilityScores.dexterity)
  }

  clone(): CharacterClass {
    throw new Error('not implemented')
  }
}

export type Equipment = {
  label: string,
  weapons: Weapon[],
  selections: WeaponType[][],
  armor: Armor[],
}

export type OtherEquipment = {
  label: string,
  weapons: Weapon[],
  selections: WeaponType[][],
  armor: Armor[]
}

export type EquipmentChoices = {
  selection: number,
  choices: Equipment[],
}

export type StartingEquipment = {
  equipmentChoices: EquipmentChoices[],
  other: OtherEquipment,
}

export default CharacterClass;
