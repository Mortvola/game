export const diceRoll = (sides: number): number => (
  Math.trunc(Math.random() * sides)
)
