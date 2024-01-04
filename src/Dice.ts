import CharacterClass from "./Character/Classes/CharacterClass";
import Creature from "./Character/Creature";
import Weapon, { DamageType, WeaponType, weaponDamage } from "./Character/Equipment/Weapon";
import { AbilityScores } from "./Character/Races/AbilityScores";
import { Race } from "./Character/Races/Race";
import { rageDamageBonus } from "./Tables";

export const diceRoll = (numDice: number, sides: number): number => {
  let sum = 0;
  for (let i = 0; i < numDice; i += 1) {
    sum += Math.trunc(Math.random() * sides) + 1
  }

  return sum;
}

export const abilityRoll = (): number => {
  const rolls = [
    diceRoll(1, 6),
    diceRoll(1, 6),
    diceRoll(1, 6),
    diceRoll(1, 6),
  ];

  rolls.sort((a: number, b: number) => b - a);

  return rolls[0] + rolls[1] + rolls[2];
}

export const abilityModifier = (score: number): number => (
  Math.floor((score - 10) / 2)
)

export const getProficiencyBonus = (level: number) => (
  Math.trunc((level - 1) / 4) + 2
)

export type Advantage = 'Disadvantage' | 'Neutral' | 'Advantage';

export const savingThrow = (creature: Creature, score: number, advantage: Advantage): number => {
  let roll = diceRoll(1, 20);

  if (advantage === 'Disadvantage') {
    const roll2 = diceRoll(1, 2);

    if (roll > roll2) {
      roll = roll2;
    }
  }
  else if (advantage === 'Advantage') {
    const roll2 = diceRoll(1, 2);

    if (roll < roll2) {
      roll = roll2;
    }
  }

  roll += abilityModifier(score);

  if (creature.hasInfluencingSpell('Bane')) {
    roll -= diceRoll(1, 4);
  }
  else if (creature.hasInfluencingSpell('Bless')) {
    roll += diceRoll(1, 4);
  }

  return roll;
}

export const attackRoll = (
  attacker: Creature,
  target: Creature,
  weapon: Weapon,
  twhoHanded: boolean,
  advantage: Advantage,
): [number, boolean] => {
  let roll = diceRoll(1, 20);

  if (advantage === 'Disadvantage') {
    const roll2 = diceRoll(1, 20);

    if (roll > roll2) {
      roll = roll2;
    }
  }
  else if (advantage === 'Advantage') {
    const roll2 = diceRoll(1, 20);

    if (roll < roll2) {
      roll = roll2;
    }
  }

  if (roll === 1) {
    // Critical miss
    return [0, false];
  }

  if (roll === 20) {
    // Critical hit
    let damage = weaponDamage(weapon, attacker.abilityScores, twhoHanded)
    + weaponDamage(weapon, attacker.abilityScores, twhoHanded);

    if (attacker.hasCondition('Rage') && [WeaponType.Martial, WeaponType.Simple].includes(weapon.type)) {
      damage += rageDamageBonus[attacker.charClass.level - 1];
    }

    return [damage, true];
  }

  roll += attacker.getAbilityModifier(weapon);

  // Add in the weapon proficiency bonus.
  roll += attacker.getWeaponProficiency(weapon);

  if (attacker.hasInfluencingSpell('Bane')) {
    roll -= diceRoll(1, 4);
  }
  else if (attacker.hasInfluencingSpell('Bless')) {
    roll += diceRoll(1, 4);
  }

  if (roll >= target.armorClass) {
    let damage = weaponDamage(weapon, attacker.abilityScores, twhoHanded);

    if (attacker.hasCondition('Rage') && [WeaponType.Martial, WeaponType.Simple].includes(weapon.type)) {
      damage += rageDamageBonus[attacker.charClass.level - 1];
    }

    return [damage, false];
  }

  return [0, false];
}

export const spellAttackRoll = (
  attacker: Creature,
  target: Creature,
  damageRoll: () => number,
  damageType: DamageType,
  advantage: Advantage,
): [number, boolean] => {
  let roll = diceRoll(1, 20);

  if (advantage === 'Disadvantage') {
    const roll2 = diceRoll(1, 20);

    if (roll > roll2) {
      roll = roll2;
    }
  }
  else if (advantage === 'Advantage') {
    const roll2 = diceRoll(1, 20);

    if (roll < roll2) {
      roll = roll2;
    }
  }

  if (roll === 1) {
    // Critical miss
    return [0, false];
  }

  if (roll === 20) {
    let damage = damageRoll() + damageRoll();

    return [damage, true];
  }

  roll += abilityModifier(attacker.spellcastingAbilityScore);

  // Add in the weapon proficiency bonus.
  roll += getProficiencyBonus(attacker.charClass.level)

  if (attacker.hasInfluencingSpell('Bane')) {
    roll -= diceRoll(1, 4);
  }
  else if (attacker.hasInfluencingSpell('Bless')) {
    roll += diceRoll(1, 4);
  }

  if (roll >= target.armorClass) {
    let damage = damageRoll();

    return [damage, false];
  }

  return [0, false];
}

export enum Abilities {
  strength = 'strength',
  charisma = 'charisma',
  dexterity = 'dexterity',
  intelligence = 'intelligence',
  constitution = 'constitution',
  wisdom = 'wisdom',
}

export const abilityRolls = () => (
  [
    abilityRoll(),
    abilityRoll(),
    abilityRoll(),
    abilityRoll(),
    abilityRoll(),
    abilityRoll(),
  ]
)

export const assignAbilityScores = (rolls: number[], charClass: CharacterClass): AbilityScores => {
  const abilities: AbilityScores = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  }

  const getMaxIndex = (r: number[]) => {
    const max = r.reduce((indexMax, _, index) => {
      if (index === 0) {
        return indexMax
      }

      return r[indexMax] < r[index] ? index : indexMax
    }, 0)

    return max;
  }
  
  // Assign the highest dice to the characters class's primary abilities
  for (const ability of charClass.primaryAbilities) {
    const max = getMaxIndex(rolls);

    abilities[ability as keyof AbilityScores] = rolls[max];

    rolls = [
      ...rolls.slice(0, max),
      ...rolls.slice(max + 1),
    ]
  }

  // Assign the remaining rolls to the unassigned abilities
  let index = 0;
  for (const [key, value] of Object.entries(abilities)) {
    if (value === 0) {
      const abilityKey = key as keyof AbilityScores;
      abilities[abilityKey] = rolls[index]
      index += 1;
    }
  }

  return abilities;
}

export const addAbilityIncreases = (abilityScores: AbilityScores, race: Race): AbilityScores => {
  const updatedScores: AbilityScores = {
    strength: 0,
    constitution: 0,
    dexterity: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  }

  for (const [key] of Object.entries(updatedScores)) {
    const abilityKey = key as keyof AbilityScores;
    updatedScores[abilityKey] = abilityScores[abilityKey] + race.abilityIncrease[abilityKey]
  }

  return updatedScores;
}

export const generateAbilityScores = (rolls: number[], race: Race, charClass: CharacterClass): AbilityScores => {
  const abilities: AbilityScores = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  }

  const getMaxIndex = (r: number[]) => {
    const max = r.reduce((indexMax, _, index) => {
      if (index === 0) {
        return indexMax
      }

      return r[indexMax] < r[index] ? index : indexMax
    }, 0)

    return max;
  }
  
  // Assign the highest dice to the characters class's primary abilities
  for (const ability of charClass.primaryAbilities) {
    const max = getMaxIndex(rolls);

    abilities[ability as keyof AbilityScores] = rolls[max] + race.abilityIncrease[ability as keyof AbilityScores];

    rolls = [
      ...rolls.slice(0, max),
      ...rolls.slice(max + 1),
    ]
  }

  // Assign the remaining rolls to the unassigned abilities
  let index = 0;
  for (const [key, value] of Object.entries(abilities)) {
    if (value === 0) {
      const abilityKey = key as keyof AbilityScores;
      abilities[abilityKey] = rolls[index] + race.abilityIncrease[abilityKey]
      index += 1;
    }
  }

  return abilities;
}
