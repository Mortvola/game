import { Abilities } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { WeaponType, getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Fighter extends CharacterClass {
  constructor(level = 1) {
    super('Fighter', level, 10, [Abilities.strength, Abilities.constitution], [Abilities.strength, Abilities.constitution])
  }

  clone(): Fighter {
    return new Fighter();
  }

  static startingEquipment(): StartingEquipment {
    return ({
      equipmentChoices: [
        {
          selection: 0,
          choices: [
            {
              label: 'Chain mail',
              armor: [getArmor('Chain mail')],
              weapons: [],
              selections: []
            },
            {
              label:  'Leather armor, long bow, & 20 arrows',
              armor: [getArmor('Leather')],
              weapons: [getWeapon('Longbow')],
              selections: []
            }
          ]
        },
        {
          selection: 0,
          choices: [
            {
              label: 'A martial weapon and shield',
              weapons: [getWeapon('Shortsword')],
              armor: [getArmor('Shield')],
              selections: [[WeaponType.Martial, WeaponType.MartialRange]]
            },
            {
              label:  'Two martial weapons',
              weapons: [getWeapon('Shortsword'), getWeapon('Warhammer')],
              armor: [],
              selections: [[WeaponType.Martial, WeaponType.MartialRange], [WeaponType.Martial, WeaponType.MartialRange]]
            },
          ]
        },
        {
          selection: 0,
          choices: [
            {
              label: 'A light crossbow & 20 bolts',
              weapons: [getWeapon('Crossbow, light')],
              armor: [],
              selections: []
            },
            {
              label:  'Two handaxes',
              weapons: [getWeapon('Handaxe'), getWeapon('Handaxe')],
              armor: [],
              selections: []
            },
          ]
        },
      ],
      other: {
        label: '',
        weapons: [],
        armor: [],
        selections: [],
      },
    })
  }
}

export default Fighter;
