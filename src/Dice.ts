export const diceRoll = (sides: number): number => (
  Math.trunc(Math.random() * sides) + 1
)

export const abilityRoll = (): number => {
  const rolls = [
    diceRoll(6),
    diceRoll(6),
    diceRoll(6),
    diceRoll(6),
  ];

  rolls.sort((a: number, b: number) => b - a);

  return rolls[0] + rolls[1] + rolls[2];
}

export const abilityModifier = (score: number): number => {
  if (score === 1) {
    return -5
  }

  if (score === 30) {
    return 10;
  }

  return Math.trunc((score - 2) / 2 - 4);
}

export const attackRoll = (armorClass: number): 'Miss' | 'Hit' | 'Critical' => {
  const roll = diceRoll(20);

  if (roll === 1) {
    return 'Miss';
  }

  if (roll === 20) {
    return 'Critical';
  }

  if (roll >= armorClass) {
    return 'Hit';
  }

  return 'Miss';
}