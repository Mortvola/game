import { abilityModifier, diceRoll } from "../../Dice";
import { AbilityScores } from "../../types";
import { DamageType, Weapon, WeaponName, WeaponProperties, WeaponType } from "./Types";

export const weapons: Weapon[] = [
  { type: WeaponType.Simple, name: 'Club', cost: '1 sp', die: [{ die: 4, numDice: 1 }], damage: DamageType.Bludgeoning, weight: 2, range: null, properties: [WeaponProperties.Light], proficiencies: ['Simple Weapons', 'Clubs'] },
  { type: WeaponType.Simple, name: 'Dagger', cost: '2 gp', die: [{ die: 4, numDice: 1 }], damage: DamageType.Piercing, weight: 1, range: [20, 60], properties: [WeaponProperties.Light, WeaponProperties.Finesse], proficiencies: ['Simple Weapons', 'Daggers'] },
  { type: WeaponType.Simple, name: 'Greatclub', cost: '2 sp', die: [{die: 8, numDice: 1 }], damage: DamageType.Bludgeoning, weight: 10, range: null, properties: [WeaponProperties.TwoHanded], proficiencies: ['Simple Weapons', 'Clubs'] },
  { type: WeaponType.Simple, name: 'Handaxe', cost: '5 gp', die: [{ die: 6, numDice: 1 }], damage: DamageType.Slashing, weight: 2, range: [20, 60], properties: [WeaponProperties.Light], proficiencies: ['Simple Weapons'] },
  { type: WeaponType.Simple, name: 'Javelin', cost: '5 sp', die: [{ die: 6, numDice: 1 }], damage: DamageType.Piercing, weight: 2, range: [30, 120], properties: [], proficiencies: ['Simple Weapons', 'Javelins'] },
  { type: WeaponType.Simple, name: 'Light Hammer', cost: '2 gp', die: [{ die: 4, numDice: 1 }], damage: DamageType.Bludgeoning, weight: 2, range: [20, 60], properties: [WeaponProperties.Light], proficiencies: ['Simple Weapons'] },
  { type: WeaponType.Simple, name: 'Mace', cost: '5 gp', die: [{ die: 6, numDice: 1 }], damage: DamageType.Bludgeoning, weight: 4, range: [30, 120], properties: [], proficiencies: ['Simple Weapons', 'Maces'] },
  { type: WeaponType.Simple, name: 'Quarterstaff', cost: '2 sp', die: [{ die: 6, numDice: 1 }, { die: 8, numDice: 1}], damage: DamageType.Bludgeoning, weight: 4, range: null, properties: [WeaponProperties.Versatile], proficiencies: ['Simple Weapons', 'Quarterstaffs'] },
  { type: WeaponType.Simple, name: 'Sickle', cost: '1 gp', die: [{ die: 4, numDice: 1 }], damage: DamageType.Slashing, weight: 2, range: null, properties: [WeaponProperties.Light], proficiencies: ['Simple Weapons', 'Sickles'] },
  { type: WeaponType.Simple, name: 'Spear', cost: '1 gp', die: [{ die: 6, numDice: 1 }, { die: 8, numDice: 1}], damage: DamageType.Slashing, weight: 3, range: [20, 60], properties: [WeaponProperties.Versatile], proficiencies: ['Simple Weapons', 'Spears'] },

  { type: WeaponType.SimpleRange, name: 'Crossbow, light', cost: '25 gp', die: [{ die: 8, numDice: 1 }], damage: DamageType.Piercing, weight: 5, range: [80, 320], properties: [WeaponProperties.Ammunition, WeaponProperties.Loading, WeaponProperties.TwoHanded], proficiencies: ['Simple Weapons', 'Light Crossbows'] },
  { type: WeaponType.SimpleRange, name: 'Dart', cost: '5 cp', die: [{ die: 4, numDice: 1 }], damage: DamageType.Piercing, weight: 0.25, range: [20, 60], properties: [WeaponProperties.Finesse], proficiencies: ['Simple Weapons', 'Darts'] },
  { type: WeaponType.SimpleRange, name: 'Shortbow', cost: '25 gp', die: [{ die: 6, numDice: 1 }], damage: DamageType.Piercing, weight: 2, range: [80, 320], properties: [WeaponProperties.TwoHanded], proficiencies: ['Simple Weapons'] },
  { type: WeaponType.SimpleRange, name: 'Sling', cost: '1 sp', die: [{ die: 4, numDice: 1 }], damage: DamageType.Bludgeoning, weight: 0, range: [30, 120], properties: [], proficiencies: ['Simple Weapons', 'Slings'] },

  { type: WeaponType.Martial, name: 'Battleaxe', cost: '10 gp', die: [{ die: 8, numDice: 1 }, { die: 10, numDice: 1 }], damage: DamageType.Slashing, weight: 4, range: null, properties: [WeaponProperties.Versatile], proficiencies: ['Martial Weapons'] },
  { type: WeaponType.Martial, name: 'Flail', cost: '10 gp', die: [{ die: 8, numDice: 1 }], damage: DamageType.Bludgeoning, weight: 2, range: null, properties: [], proficiencies: ['Martial Weapons'] },
  { type: WeaponType.Martial, name: 'Glaive', cost: '20 gp', die: [{ die: 10, numDice: 1 }], damage: DamageType.Slashing, weight: 6, range: null, properties: [WeaponProperties.Heavy, WeaponProperties.Reach, WeaponProperties.TwoHanded], proficiencies: ['Martial Weapons'] },
  { type: WeaponType.Martial, name: 'Greataxe', cost: '30 gp', die: [{ die: 12, numDice: 1 }], damage: DamageType.Slashing, weight: 7, range: null, properties: [WeaponProperties.Heavy, WeaponProperties.TwoHanded], proficiencies: ['Martial Weapons'] },
  { type: WeaponType.Martial, name: 'Greatsword', cost: '50 gp', die: [{ die: 6, numDice: 2 }], damage: DamageType.Slashing, weight: 6, range: null, properties: [WeaponProperties.Heavy, WeaponProperties.TwoHanded], proficiencies: ['Martial Weapons'] },
  { type: WeaponType.Martial, name: 'Halberd', cost: '20 gp', die: [{ die: 10, numDice: 1 }], damage: DamageType.Slashing, weight: 6, range: null, properties: [WeaponProperties.Heavy, WeaponProperties.Reach, WeaponProperties.TwoHanded], proficiencies: ['Martial Weapons'] },
  { type: WeaponType.Martial, name: 'Lance', cost: '10 gp', die: [{ die: 12, numDice: 1 }], damage: DamageType.Piercing, weight: 6, range: null, properties: [WeaponProperties.Reach, WeaponProperties.Special], proficiencies: ['Martial Weapons'] },
  { type: WeaponType.Martial, name: 'Longsword', cost: '15 gp', die: [{ die: 8, numDice: 1 }, { die: 10, numDice: 1 }], damage: DamageType.Slashing, weight: 3, range: null, properties: [WeaponProperties.Versatile], proficiencies: ['Martial Weapons', 'Longswords'] },
  { type: WeaponType.Martial, name: 'Maul', cost: '10 gp', die: [{ die: 6, numDice: 2 }], damage: DamageType.Bludgeoning, weight: 10, range: null, properties: [WeaponProperties.Heavy, WeaponProperties.TwoHanded], proficiencies: ['Martial Weapons'] },
  { type: WeaponType.Martial, name: 'Morningstar', cost: '15 gp', die: [{ die: 8, numDice: 1 }], damage: DamageType.Piercing, weight: 4, range: null, properties: [], proficiencies: ['Martial Weapons'] },
  { type: WeaponType.Martial, name: 'Pike', cost: '5 gp', die: [{ die: 10, numDice: 1 }], damage: DamageType.Piercing, weight: 18, range: null, properties: [WeaponProperties.Heavy, WeaponProperties.Reach, WeaponProperties.TwoHanded], proficiencies: ['Martial Weapons'] },
  { type: WeaponType.Martial, name: 'Rapier', cost: '25 gp', die: [{ die: 8, numDice: 1 }], damage: DamageType.Piercing, weight: 2, range: null, properties: [WeaponProperties.Finesse], proficiencies: ['Martial Weapons', 'Rapiers'] },
  { type: WeaponType.Martial, name: 'Scimitar', cost: '25 gp', die: [{ die: 6, numDice: 1 }], damage: DamageType.Slashing, weight: 3, range: null, properties: [WeaponProperties.Finesse, WeaponProperties.Light], proficiencies: ['Martial Weapons', 'Scimitars'] },
  { type: WeaponType.Martial, name: 'Shortsword', cost: '10 gp', die: [{ die: 6, numDice: 1 }], damage: DamageType.Piercing, weight: 2, range: null, properties: [WeaponProperties.Finesse, WeaponProperties.Light], proficiencies: ['Martial Weapons', 'Shortswords'] },
  { type: WeaponType.Martial, name: 'Trident', cost: '5 gp', die: [{ die: 6, numDice: 1 }, { die: 8, numDice: 1 }], damage: DamageType.Piercing, weight: 4, range: [20, 60], properties: [WeaponProperties.Versatile], proficiencies: ['Martial Weapons'] },
  { type: WeaponType.Martial, name: 'War pick', cost: '5 gp', die: [{ die: 8, numDice: 1 }], damage: DamageType.Piercing, weight: 2, range: null, properties: [], proficiencies: ['Martial Weapons'] },
  { type: WeaponType.Martial, name: 'Warhammer', cost: '15 gp', die: [{ die: 8, numDice: 1 }, { die: 10, numDice: 1 }], damage: DamageType.Bludgeoning, weight: 2, range: null, properties: [WeaponProperties.Versatile], proficiencies: ['Martial Weapons'] },
  { type: WeaponType.Martial, name: 'Whip', cost: '2 gp', die: [{ die: 4, numDice: 1 }], damage: DamageType.Slashing, weight: 3, range: null, properties: [WeaponProperties.Finesse, WeaponProperties.Reach], proficiencies: ['Martial Weapons'] },

  { type: WeaponType.MartialRange, name: 'Blowgun', cost: '10 gp', die: [{ die: 1, numDice: 1 }], damage: DamageType.Piercing, weight: 1, range: [25, 100], properties: [WeaponProperties.Ammunition, WeaponProperties.Loading], proficiencies: ['Martial Weapons'] },
  { type: WeaponType.MartialRange, name: 'Crossbow, hand', cost: '75 gp', die: [{ die: 6, numDice: 1 }], damage: DamageType.Piercing, weight: 3, range: [30, 120], properties: [WeaponProperties.Ammunition, WeaponProperties.Loading, WeaponProperties.Light], proficiencies: ['Martial Weapons', 'Hand Crossbows'] },
  { type: WeaponType.MartialRange, name: 'Crossbow, heavy', cost: '50 gp', die: [{ die: 10, numDice: 1 }], damage: DamageType.Piercing, weight: 18, range: [100, 400], properties: [WeaponProperties.Ammunition, WeaponProperties.Loading, WeaponProperties.Heavy, WeaponProperties.TwoHanded], proficiencies: ['Martial Weapons'] },
  { type: WeaponType.MartialRange, name: 'Longbow', cost: '50 gp', die: [{ die: 8, numDice: 1 }], damage: DamageType.Piercing, weight: 2, range: [150, 600], properties: [WeaponProperties.Heavy, WeaponProperties.TwoHanded, WeaponProperties.Ammunition], proficiencies: ['Martial Weapons'] },
  { type: WeaponType.MartialRange, name: 'Net', cost: '1 gp', die: [], damage: DamageType.None, weight: 3, range: [5, 15], properties: [WeaponProperties.Special], proficiencies: ['Martial Weapons'] },
]

export const getWeapon = (name: WeaponName): Weapon => {
  const w = weapons.find((w) => w.name === name)

  if (w === undefined) {
    throw new Error(`Unknown weapon: ${name}`)
  }

  return w;
}

export const weaponDamage = (weapon: Weapon, abilityScores: AbilityScores, twoHanded: boolean): number => {
  let dieIndex = 0;
  if (twoHanded && weapon.die.length === 2) {
    dieIndex = 1;
  }

  const roll = diceRoll(weapon.die[dieIndex].numDice, weapon.die[dieIndex].die)

  if (
    [WeaponType.MartialRange, WeaponType.SimpleRange].includes(weapon.type)
    || (weapon.properties.includes(WeaponProperties.Finesse)
    && abilityScores.dexterity > abilityScores.strength)
  ) {
    return roll + abilityModifier(abilityScores.dexterity);
  }

  return roll + abilityModifier(abilityScores.strength);
}

export const meanDamage = (weapon: Weapon) => (
  ((weapon.die[0].die + 1) / 2) * weapon.die[0].numDice
)
