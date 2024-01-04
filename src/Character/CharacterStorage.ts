import { Party } from "../UserInterface/PartyList"
import Character from "./Character"
import { ArmorName, getArmor } from "./Equipment/Armor"
import { WeaponName, getWeapon } from "./Equipment/Weapon"
import { AbilityScores } from "./Races/AbilityScores"
import { clericSpells, druidSpells, getSpell, wizardSpells } from "./Actions/Spells/Spells"
import { getClass, getRace } from "./Utilities"

export type CharacterStorage = {
  name: string,
  charClass: string,
  race: string,
  abilityScores: AbilityScores,
  maxHitPoints: number,
  weapons: string[],
  armor: string[],
  cantrips: string[],
  spells: { name: string, prepared: boolean }[],
  knownSpells: string[],
  equipped: {
    meleeWeapon: string | null,
    rangeWeapon: string | null,
    armor: string | null,
    shield: string | null,
  },
  included?: boolean,
}

export type CharacterStorageParty = {
  members: CharacterStorage[],
  automate: boolean,
}

export const restoreCharacters = (a: CharacterStorage[]): { included: boolean, character: Character }[] => {
  const team = a.map((c) => {
    const race = getRace(c.race);
    const charClass = getClass(c.charClass);

    if (race && charClass) {
      const weapons = c.weapons.map((w) => getWeapon(w as WeaponName))
      const armor = c.armor.map((a) => getArmor(a as ArmorName))

      const character = new Character(c.abilityScores, race, charClass, weapons, armor);

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

      if (c.cantrips) {
        if (c.charClass === 'Wizard') {
          character.cantrips = c.cantrips.map((s) => getSpell(wizardSpells, s)!)
        }
        else if (c.charClass === 'Cleric') {
          character.cantrips = c.cantrips.map((s) => getSpell(clericSpells, s)!)
        }
        else if (c.charClass === 'Druid') {
          character.cantrips = c.cantrips.map((s) => getSpell(druidSpells, s)!)
        }
      }

      if (c.spells) {
        if (c.charClass === 'Wizard') {
          character.spells = c.spells.filter((s) => s !== null && s.prepared).map((s) => getSpell(wizardSpells, s.name)!)
          character.knownSpells = c.knownSpells
            ? [
              ...(c.knownSpells ?? []).map((s) => getSpell(wizardSpells, s)!),
            ]
            : [
              ...c.spells.map((s) => getSpell(wizardSpells, s.name)!),
            ]
        }
        else if (c.charClass === 'Cleric') {
          character.spells = c.spells.filter((s) => s !== null && s.prepared).map((s) => getSpell(clericSpells, s.name)!)
        }
        else if (c.charClass === 'Druid') {
          character.spells = c.spells.filter((s) => s !== null && s.prepared).map((s) => getSpell(druidSpells, s.name)!)
        }
      }

      return ({
        included: c.included ?? true,
        character: character,
      });
    }

    return undefined;
  })
    .filter((entry) => entry !== undefined) as { included: boolean, character: Character }[]

  return team;
}

export const characterStorageParty = (party: Party): CharacterStorageParty => ({
  members: party.members.map((m) => {
    const c = m.character;

    const s: CharacterStorage = {
      name: c.name,
      charClass: c.charClass.name,
      race: c.race.name,
      abilityScores: c.abilityScores,
      maxHitPoints: c.maxHitPoints,
      weapons: c.weapons.map((w) => w.name),
      armor: c.armor.map((a) => a.name),
      cantrips: c.cantrips.map((s) => s.name ),
      spells: c.spells.map((s) => ({ name: s.name, prepared: true })),
      knownSpells: c.knownSpells !== null ? c.knownSpells.map((s) => s.name) : [],
      equipped: {
        meleeWeapon: c.equipped.meleeWeapon?.name ?? null,
        rangeWeapon: c.equipped.rangeWeapon?.name ?? null,
        armor: c.equipped.armor?.name ?? null,
        shield: c.equipped.shield?.name ?? null,
      },
      included: m.included,
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
  // const team2 = restoreParty('team2');

  return [team1];
}