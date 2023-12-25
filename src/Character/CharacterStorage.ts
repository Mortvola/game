import { Party } from "../UserInterface/PartyList"
import Character from "./Character"
import { ArmorName, getArmor } from "./Equipment/Armor"
import { WeaponName, getWeapon } from "./Equipment/Weapon"
import { AbilityScores } from "./Races/AbilityScores"
import { getClass, getRace } from "./Utilities"

export type CharacterStorage = {
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

export type CharacterStorageParty = {
  members: CharacterStorage[],
  automate: boolean,
}

export const restoreCharacters = (a: CharacterStorage[]): Character[] => {
  const team = a.filter((c, index) => index <= 3).map((c) => {
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

export const characterStorageParty = (party: Party): CharacterStorageParty => ({
  members: party.members.map((c) => {
    const s: CharacterStorage = {
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
  }),
  automate: party.automate,
})

export const characterStorageParties = (parties: Party[]): CharacterStorageParty[] => (
  [characterStorageParty(parties[0]), characterStorageParty(parties[1])]
)

const stringifyParty = (party: Party): string => {
  return JSON.stringify(
    characterStorageParty(party)
  )
}

export const stringifyParties = (parties: Party[]) => (
  [stringifyParty(parties[0]), stringifyParty(parties[1])]
)

export const storeParties = (parties: Party[]): void => {
  const stringifiedParties = stringifyParties(parties);
  localStorage.setItem('team1', stringifiedParties[0]);
  localStorage.setItem('team2', stringifiedParties[1]);
}

const restoreParty = (id: string): Party => {
  const s1 = localStorage.getItem(id);

  if (s1) {
    const a = JSON.parse(s1) as CharacterStorageParty;
    return ({
      members: restoreCharacters(a.members),
      automate: a.automate,
    })
  }

  return ({
    members: [],
    automate: false,
  });
}

export const restoreParties = (): Party[] => {
  const team1 = restoreParty('team1');
  const team2 = restoreParty('team2');

  return [team1, team2];
}