import { Abilities } from "./Abilities";
import { abilityModifier } from "../../Dice";
import type { A, AbilityScores, ActionFactory, ActionInterface } from "../../types";
import { getAction } from "../Actions/Actions";
import { getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";
import { WeaponType } from "../Equipment/Types";

class Barbarian extends CharacterClass {
  constructor(level = 1) {
    const actions: ActionFactory<ActionInterface>[] = [];

    const action = getAction('Rage');
    if (action) {
      actions.push(action);
    }

    super(
      'Barbarian', level, 12,
      [Abilities.strength, Abilities.constitution],
      [Abilities.strength, Abilities.constitution],
      ['Simple Weapons', 'Martial Weapons'],
      actions,
    )
  }

  unarmoredDefence(abilityScores: AbilityScores) {
    return 10 + abilityModifier(abilityScores.dexterity) + abilityModifier(abilityScores.constitution)
  }

  clone(): Barbarian {
    return new Barbarian();
  }

  static startingEquipment(): StartingEquipment {
    return ({
      equipmentChoices: [
        {
          selection: 0,
          choices: [
            {
              label: 'A great axe',
              armor: [],
              weapons: [getWeapon('Greataxe')],
              selections: []
            },
            {
              label: 'A martial melee weapon',
              armor: [],
              weapons: [getWeapon('Shortsword')],
              selections: [[WeaponType.Martial]]
            }
          ]
        },
        {
          selection: 0,
          choices: [
            {
              label: 'Two handaxes',
              weapons: [getWeapon('Handaxe'), getWeapon('Handaxe')],
              armor: [],
              selections: []
            },
            {
              label:  'A simple weapon',
              weapons: [getWeapon('Shortbow')],
              armor: [],
              selections: [[WeaponType.Simple, WeaponType.SimpleRange]]
            },
          ]
        },
      ],
      other: {
        label: 'Four javelins',
        weapons: [getWeapon('Javelin'), getWeapon('Javelin'), getWeapon('Javelin'), getWeapon('Javelin')],
        armor: [],
        selections: [],
      },
    })
  }
}

export default Barbarian;
