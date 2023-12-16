export enum ArmorType {
  Light,
  Medium,
  Heavey,
  Shield,
}

export type ArmorName = 'Padded' | 'Leather' | 'Studded leather' | 'Hide' | 'Chain shirt' | 'Scale mail'
  | 'Breastplate' | 'Half plate' | 'Ring mail' | 'Chain mail' | 'Split' | 'Plate' | 'Shield';

export type Armor = {
  type: ArmorType,
  name: ArmorName,
  cost: string,
  armorClass: number,
  dexterityModifier: boolean,
  maxModifier: null | number,
  strength: number | null,
  stealthDisadvantage: boolean,
  weight: number,
}

export const armor: Armor[] = [
  { type: ArmorType.Light, name: 'Padded', cost: '5 gp', armorClass: 11, dexterityModifier: true, maxModifier: null, strength: null, stealthDisadvantage: true, weight: 8 },
  { type: ArmorType.Light, name: 'Leather', cost: '10 gp', armorClass: 11, dexterityModifier: true, maxModifier: null, strength: null, stealthDisadvantage: false, weight: 10 },
  { type: ArmorType.Light, name: 'Studded leather', cost: '45 gp', armorClass: 12, dexterityModifier: true, maxModifier: null, strength: null, stealthDisadvantage: false, weight: 13 },

  { type: ArmorType.Medium, name: 'Hide', cost: '10 gp', armorClass: 12, dexterityModifier: true, maxModifier: 2, strength: null, stealthDisadvantage: false, weight: 12 },
  { type: ArmorType.Medium, name: 'Chain shirt', cost: '50 gp', armorClass: 13, dexterityModifier: true, maxModifier: 2, strength: null, stealthDisadvantage: false, weight: 20 },
  { type: ArmorType.Medium, name: 'Scale mail', cost: '50 gp', armorClass: 14, dexterityModifier: true, maxModifier: 2, strength: null, stealthDisadvantage: true, weight: 45 },
  { type: ArmorType.Medium, name: 'Breastplate', cost: '400 gp', armorClass: 14, dexterityModifier: true, maxModifier: 2, strength: null, stealthDisadvantage: false, weight: 20 },
  { type: ArmorType.Medium, name: 'Half plate', cost: '750 gp', armorClass: 15, dexterityModifier: true, maxModifier: 2, strength: null, stealthDisadvantage: true, weight: 40 },

  { type: ArmorType.Heavey, name: 'Ring mail', cost: '30 gp', armorClass: 14, dexterityModifier: false, maxModifier: null, strength: null, stealthDisadvantage: true, weight: 40 },
  { type: ArmorType.Heavey, name: 'Chain mail', cost: '75 gp', armorClass: 16, dexterityModifier: false, maxModifier: null, strength: 13, stealthDisadvantage: true, weight: 55 },
  { type: ArmorType.Heavey, name: 'Split', cost: '200 gp', armorClass: 17, dexterityModifier: false, maxModifier: null, strength: 15, stealthDisadvantage: true, weight: 60 },
  { type: ArmorType.Heavey, name: 'Plate', cost: '1500 gp', armorClass: 18, dexterityModifier: false, maxModifier: null, strength: 15, stealthDisadvantage: true, weight: 65 },

  { type: ArmorType.Shield, name: 'Shield', cost: '10 gp', armorClass: 2, dexterityModifier: false, maxModifier: null, strength: null, stealthDisadvantage: false, weight: 6 },
]

export const getArmor = (name: ArmorName): Armor => {
  const a = armor.find((w) => w.name === name)
  if (a === undefined) {
    throw new Error(`Unknown armor: ${name}`)
  }
  return a;
}
