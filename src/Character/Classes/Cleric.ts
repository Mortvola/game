import { Abilities } from "./Abilities";
import { getArmor } from "../Equipment/Armor";
import { WeaponType, getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Cleric extends CharacterClass {
  constructor(level = 1) {
    super(
      'Cleric', level, 8, [Abilities.wisdom], [Abilities.wisdom, Abilities.charisma],
      ['Simple Weapons']
    )
  }

  clone(): Cleric {
    return new Cleric();
  }

  static startingEquipment(): StartingEquipment {
    return ({
      equipmentChoices: [
        {
          selection: 0,
          choices: [
            {
              label: 'A mace',
              armor: [],
              weapons: [getWeapon('Mace')],
              selections: []
            },
            {
              label:  'A warhammer',
              armor: [],
              weapons: [getWeapon('Warhammer')],
              selections: []
            },
          ]
        },
        {
          selection: 0,
          choices: [
            {
              label: 'Scale mail',
              armor: [getArmor('Scale mail')],
              weapons: [],
              selections: []
            },
            {
              label: 'Leather armor',
              armor: [getArmor('Leather')],
              weapons: [],
              selections: []
            },
            {
              label:  'Chain mail',
              armor: [getArmor('Chain mail')],
              weapons: [],
              selections: []
            },
          ]
        },
        {
          selection: 0,
          choices: [
            {
              label: 'A light crossbow & 20 bolts',
              armor: [],
              weapons: [getWeapon('Crossbow, light')],
              selections: []
            },
            {
              label:  'A simple weapon',
              armor: [],
              weapons: [getWeapon('Dagger')],
              selections: [[WeaponType.Simple, WeaponType.SimpleRange]]
            },
          ]
        },
      ],
      other: {
        label: 'A shield',
        weapons: [],
        armor: [getArmor('Shield')],
        selections: [],
      },
    })
  }
}

export default Cleric;
