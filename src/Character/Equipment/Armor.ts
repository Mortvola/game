enum ArmorType {
  Light,
  Medium,
  Heavey,
  Shield,
}

type Armor = {
  type: ArmorType,
  name: string,
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
  { type: ArmorType.Light, name: 'Studded Leather', cost: '45 gp', armorClass: 12, dexterityModifier: true, maxModifier: null, strength: null, stealthDisadvantage: false, weight: 13 },

  { type: ArmorType.Medium, name: 'Hide', cost: '10 gp', armorClass: 12, dexterityModifier: true, maxModifier: 2, strength: null, stealthDisadvantage: false, weight: 12 },
  { type: ArmorType.Medium, name: 'Chain shirt', cost: '50 gp', armorClass: 13, dexterityModifier: true, maxModifier: 2, strength: null, stealthDisadvantage: false, weight: 20 },
  { type: ArmorType.Medium, name: 'Scale Mail', cost: '50 gp', armorClass: 14, dexterityModifier: true, maxModifier: 2, strength: null, stealthDisadvantage: true, weight: 45 },
  { type: ArmorType.Medium, name: 'Breastplate', cost: '400 gp', armorClass: 14, dexterityModifier: true, maxModifier: 2, strength: null, stealthDisadvantage: false, weight: 20 },
  { type: ArmorType.Medium, name: 'Half Plate', cost: '750 gp', armorClass: 15, dexterityModifier: true, maxModifier: 2, strength: null, stealthDisadvantage: true, weight: 40 },

  { type: ArmorType.Heavey, name: 'Ring Mail', cost: '30 gp', armorClass: 14, dexterityModifier: false, maxModifier: null, strength: null, stealthDisadvantage: true, weight: 40 },
  { type: ArmorType.Heavey, name: 'Chain Mail', cost: '75 gp', armorClass: 16, dexterityModifier: false, maxModifier: null, strength: 13, stealthDisadvantage: true, weight: 55 },
  { type: ArmorType.Heavey, name: 'Split', cost: '200 gp', armorClass: 17, dexterityModifier: false, maxModifier: null, strength: 15, stealthDisadvantage: true, weight: 60 },
  { type: ArmorType.Heavey, name: 'Plate', cost: '1500 gp', armorClass: 18, dexterityModifier: false, maxModifier: null, strength: 15, stealthDisadvantage: true, weight: 65 },
]

export const shields: Armor[] = [
  { type: ArmorType.Shield, name: 'Shield', cost: '10 gp', armorClass: 2, dexterityModifier: false, maxModifier: null, strength: null, stealthDisadvantage: false, weight: 6 },
]
