import Character from "./Character/Character";
import CharacterClass from "./Character/Classes/CharacterClass";
import Creature from "./Character/Creature";
import Weapon, { WeaponProperties, WeaponType, weaponDamage } from "./Character/Equipment/Weapon";
import { AbilityScores } from "./Character/Races/AbilityScores";
import { Race } from "./Character/Races/Race";

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

export const attackRoll = (attacker: Creature, target: Creature, weapon: Weapon, twhoHanded: boolean): [number, boolean] => {
  let roll = diceRoll(1, 20);

  if (roll === 1) {
    // Critical miss
    return [0, false];
  }

  if (roll === 20) {
    // Critical hit
    return [weaponDamage(weapon, attacker.abilityScores, twhoHanded)
      + weaponDamage(weapon, attacker.abilityScores, twhoHanded),
      true];
  }

  // Add in the ability score modifier
  let abilityScore = attacker.abilityScores.strength;
  if (
    [WeaponType.MartialRange, WeaponType.SimpleRange].includes(weapon.type)
    || (weapon.properties.includes(WeaponProperties.Finesse)
    && attacker.abilityScores.dexterity > attacker.abilityScores.strength)
  ) {
    abilityScore = attacker.abilityScores.dexterity;
  }
  
  roll += abilityModifier(abilityScore);

  // Add in the weapon proficiency bonus.
  roll += attacker.getWeaponProficiency(weapon);

  if (roll >= target.armorClass) {
    return [weaponDamage(weapon, attacker.abilityScores, twhoHanded), false];
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

export const generateAbilityScores = (race: Race, charClass: CharacterClass): AbilityScores => {
  const abilities: AbilityScores = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  }

  // Roll the dice six times
  let rolls = [
    abilityRoll(),
    abilityRoll(),
    abilityRoll(),
    abilityRoll(),
    abilityRoll(),
    abilityRoll(),
  ]

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
