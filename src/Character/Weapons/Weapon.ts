import { abilityModifier, diceRoll } from "../../Dice";
import { AbilityScores } from "../Races/AbilityScores";

enum WeaponProperties {
  Light,
  Finesse,
  TwoHanded,
  Versatile,
  Loading,
  Ammunition,
}

enum DamageType {
  Bludgeoning,
  Piercing,
  Slashing,
}

enum WeaponType {
  Simple,
  SimpleRange,
  Martial,
}

type DamageDice = {
  die: number,
  numDice: number,
}

type Weapon = {
  type: WeaponType,
  name: string,
  cost: string,
  die: DamageDice[],
  damage: DamageType,
  weight: number,
  range: null | [number, number]
  properties: WeaponProperties[],
}

export const weapons: Weapon[] = [
  { type: WeaponType.Simple, name: 'Club', cost: '1 sp', die: [{ die: 4, numDice: 1 }], damage: DamageType.Bludgeoning, weight: 2, range: null, properties: [WeaponProperties.Light] },
  { type: WeaponType.Simple, name: 'Dagger', cost: '2 gp', die: [{ die: 4, numDice: 1 }], damage: DamageType.Piercing, weight: 1, range: [20, 60], properties: [WeaponProperties.Light, WeaponProperties.Finesse] },
  { type: WeaponType.Simple, name: 'Greatclub', cost: '2 sp', die: [{die: 8, numDice: 1 }], damage: DamageType.Bludgeoning, weight: 10, range: null, properties: [WeaponProperties.TwoHanded] },
  { type: WeaponType.Simple, name: 'Handaxe', cost: '5 gp', die: [{ die: 6, numDice: 1 }], damage: DamageType.Slashing, weight: 2, range: [20, 60], properties: [WeaponProperties.Light] },
  { type: WeaponType.Simple, name: 'Javelin', cost: '5 sp', die: [{ die: 6, numDice: 1 }], damage: DamageType.Piercing, weight: 2, range: [30, 120], properties: [] },
  { type: WeaponType.Simple, name: 'Light Hammer', cost: '2 gp', die: [{ die: 4, numDice: 1 }], damage: DamageType.Bludgeoning, weight: 2, range: [20, 60], properties: [WeaponProperties.Light] },
  { type: WeaponType.Simple, name: 'Mace', cost: '5 gp', die: [{ die: 6, numDice: 1 }], damage: DamageType.Bludgeoning, weight: 4, range: [30, 120], properties: [] },
  { type: WeaponType.Simple, name: 'QuarterStaff', cost: '2 sp', die: [{ die: 6, numDice: 1 }, { die: 8, numDice: 1}], damage: DamageType.Bludgeoning, weight: 4, range: null, properties: [WeaponProperties.Versatile] },
  { type: WeaponType.Simple, name: 'Sickle', cost: '1 gp', die: [{ die: 4, numDice: 1 }], damage: DamageType.Slashing, weight: 2, range: null, properties: [WeaponProperties.Light] },
  { type: WeaponType.Simple, name: 'Spear', cost: '1 gp', die: [{ die: 6, numDice: 1 }, { die: 8, numDice: 1}], damage: DamageType.Slashing, weight: 3, range: [20, 60], properties: [WeaponProperties.Versatile] },
  { type: WeaponType.SimpleRange, name: 'Crossbow, light', cost: '25 gp', die: [{ die: 8, numDice: 1 }], damage: DamageType.Piercing, weight: 5, range: [80, 320], properties: [WeaponProperties.Ammunition, WeaponProperties.Loading, WeaponProperties.TwoHanded] },
  { type: WeaponType.SimpleRange, name: 'Dart', cost: '5 cp', die: [{ die: 4, numDice: 1 }], damage: DamageType.Piercing, weight: 0.25, range: [20, 60], properties: [WeaponProperties.Finesse] },
  { type: WeaponType.SimpleRange, name: 'Shortbow', cost: '25 gp', die: [{ die: 6, numDice: 1 }], damage: DamageType.Piercing, weight: 2, range: [80, 320], properties: [WeaponProperties.TwoHanded] },
  { type: WeaponType.SimpleRange, name: 'Sling', cost: '1 sp', die: [{ die: 4, numDice: 1 }], damage: DamageType.Bludgeoning, weight: 0, range: [30, 120], properties: [] },
  { type: WeaponType.Martial, name: 'Shortsword', cost: '10 gp', die: [{ die: 6, numDice: 1 }], damage: DamageType.Piercing, weight: 2, range: null, properties: [WeaponProperties.Finesse, WeaponProperties.Light] },
]

export const getWeapon = (name: string): Weapon | undefined => {
  return weapons.find((w) => w.name === name)
}

export const weaponDamage = (weapon: Weapon, abilities: AbilityScores, twoHanded: boolean): number => {
  let roll = 0
  let dieIndex = 0;
  if (twoHanded && weapon.die.length === 2) {
    dieIndex = 1;
  }

  for (let i = 0; i < weapon.die[dieIndex].numDice; i += 1) {
    roll += diceRoll(weapon.die[dieIndex].die)
  }

  if (weapon.type === WeaponType.SimpleRange) {
    return roll + abilityModifier(abilities.dexterity);
  }

  return roll + abilityModifier(abilities.strength);
}

export default Weapon;
