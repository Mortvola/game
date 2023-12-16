import CharacterClass from "./Character/Classes/CharacterClass";
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

export const attackRoll = (armorClass: number, abilityScore: number): 'Miss' | 'Hit' | 'Critical' => {
  let roll = diceRoll(1, 20);

  if (roll === 1) {
    return 'Miss';
  }

  if (roll === 20) {
    return 'Critical';
  }

  roll += abilityModifier(abilityScore);

  if (roll >= armorClass) {
    return 'Hit';
  }

  return 'Miss';
}

export const proficiencyBonus = (level: number) => (
  Math.trunc((level - 1) / 4) + 2
)

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
