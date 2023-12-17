import { Abilities, abilityModifier } from "../../Dice";
import { WeaponType, getWeapon } from "../Equipment/Weapon";
import { AbilityScores } from "../Races/AbilityScores";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Barbarian extends CharacterClass {
  constructor(level = 1) {
    super(
      'Barbarian', level, 12, [Abilities.strength, Abilities.constitution], [Abilities.strength, Abilities.constitution],
      ['Simple Weapons', 'Martial Weapons']
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
