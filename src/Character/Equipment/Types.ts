export enum WeaponProperties {
  Light,
  Finesse,
  TwoHanded,
  Versatile,
  Loading,
  Ammunition,
  Heavy,
  Reach,
  Special,
}

export enum DamageType {
  Acid,
  Bludgeoning,
  Cold,
  Fire,
  Force,
  Lightning,
  Necrotic,
  Piercing,
  Poison,
  Psycnic,
  Radiant,
  Slashing,
  Thunder,
  None,
}

export enum WeaponType {
  Simple,
  SimpleRange,
  Martial,
  MartialRange,
}

export type DamageDice = {
  die: number,
  numDice: number,
}

export type WeaponProficiencies = 
  'Simple Weapons'
  | 'Martial Weapons'
  | 'Hand Crossbows'
  | 'Light Crossbows'
  | 'Longswords'
  | 'Rapiers'
  | 'Shortswords'
  | 'Clubs'
  | 'Daggers'
  | 'Darts'
  | 'Javelins'
  | 'Maces'
  | 'Quarterstaffs'
  | 'Scimitars'
  | 'Sickles'
  | 'Slings'
  | 'Spears'
  ;

export type WeaponName = 'Club' | 'Dagger' | 'Greatclub' | 'Handaxe' | 'Javelin' | 'Light Hammer' | 'Mace'
  | 'Quarterstaff' | 'Sickle' | 'Spear' | 'Crossbow, light' | 'Dart' | 'Shortbow' | 'Sling'
  | 'Battleaxe' | 'Flail' | 'Glaive' | 'Greataxe' | 'Greatsword' | 'Halberd' | 'Lance'
  | 'Longsword' | 'Maul' | 'Morningstar' | 'Pike' | 'Rapier' | 'Scimitar' | 'Shortsword' | 'Trident'
  | 'War pick' | 'Warhammer' | 'Whip' | 'Blowgun' | 'Crossbow, hand' | 'Crossbow, heavy'
  | 'Longbow' | 'Net';

export type Weapon = {
  type: WeaponType,
  name: WeaponName,
  cost: string,
  die: DamageDice[],
  damage: DamageType,
  weight: number,
  range: null | [number, number]
  properties: WeaponProperties[],
  proficiencies: WeaponProficiencies[],
}
