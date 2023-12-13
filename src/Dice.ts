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
