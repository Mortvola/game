import Character from "./Character"
import { ArmorName, getArmor } from "./Equipment/Armor"
import { WeaponName, getWeapon } from "./Equipment/Weapon"
import { AbilityScores } from "./Races/AbilityScores"
import { getClass, getRace } from "./Utilities"

export type CharactorStorage = {
  name: string,
  charClass: string,
  race: string,
  abilityScores: AbilityScores,
  maxHitPoints: number,
  weapons: string[],
  armor: string[],
  equipped: {
    meleeWeapon: string | null,
    rangeWeapon: string | null,
    armor: string | null,
    shield: string | null,
  }
}

export const restoreCharactors = (a: CharactorStorage[]) => {
  const team = a.map((c) => {
    const race = getRace(c.race);
    const charClass = getClass(c.charClass);

    if (race && charClass) {
      const weapons = c.weapons.map((w) => getWeapon(w as WeaponName))
      const armor = c.armor.map((a) => getArmor(a as ArmorName))

      const character = new Character(race, charClass, weapons, armor);

      character.name = c.name;
      
      if (c.equipped.meleeWeapon) {
        character.equipped.meleeWeapon = getWeapon(c.equipped.meleeWeapon as WeaponName);
      }

      if (c.equipped.rangeWeapon) {
        character.equipped.rangeWeapon = getWeapon(c.equipped.rangeWeapon as WeaponName);
      }

      if (c.equipped.armor) {
        character.equipped.armor = getArmor(c.equipped.armor as ArmorName);
      }

      if (c.equipped.shield) {
        character.equipped.shield = getArmor(c.equipped.shield as ArmorName);
      }

      return character;
    }

    return undefined;
  })
    .filter((entry) => entry !== undefined) as Character[]

  return team;
}

const stringifyParty = (party: Character[]) => {
  return JSON.stringify(
    party.map((c) => {
      const s: CharactorStorage = {
        name: c.name,
        charClass: c.charClass.name,
        race: c.race.name,
        abilityScores: c.abilityScores,
        maxHitPoints: c.maxHitPoints,
        weapons: c.weapons.map((w) => w.name),
        armor: c.armor.map((a) => a.name),
        equipped: {
          meleeWeapon: c.equipped.meleeWeapon?.name ?? null,
          rangeWeapon: c.equipped.rangeWeapon?.name ?? null,
          armor: c.equipped.armor?.name ?? null,
          shield: c.equipped.shield?.name ?? null,
        }
      }

      return s;
    })
  )
}

export const storeParties = (parties: Character[][]): void => {
  localStorage.setItem('team1', stringifyParty(parties[0]))
  localStorage.setItem('team2', stringifyParty(parties[1]))
}

const restoreParty = (id: string): Character[] => {
  const s1 = localStorage.getItem(id);

  if (s1) {
    const a = JSON.parse(s1) as CharactorStorage[];
    return restoreCharactors(a);
  }

  return [];
}

export const restoreParties = (): Character[][] => {
  const team1 = restoreParty('team1');
  const team2 = restoreParty('team2');

  return [team1, team2];
}