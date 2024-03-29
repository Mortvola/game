import { Abilities } from "./Abilities";
import { getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";
import { WeaponType } from "../Equipment/Types";

class Sorcerer extends CharacterClass {
  constructor(level = 1) {
    super(
      'Sorcerer', level, 6, [Abilities.charisma], [Abilities.constitution, Abilities.charisma],
      ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light Crossbows']
    )
  }

  clone(): Sorcerer {
    return new Sorcerer();
  }

  static startingEquipment(): StartingEquipment {
    return ({
      equipmentChoices: [
        {
          selection: 0,
          choices: [
            {
              label: 'A light crossbow & 20 bolts',
              armor: [],
              weapons: [getWeapon('Crossbow, light')],
              selections: [],
            },
            {
              label:  'A simple weapon',
              armor: [],
              weapons: [getWeapon('Dagger')],
              selections: [[WeaponType.Simple, WeaponType.SimpleRange]],
            },
          ]
        },
      ],
      other: {
        label: 'Two daggers',
        weapons: [getWeapon('Dagger'), getWeapon('Dagger')],
        armor: [],
        selections: [],
      },
    })
  }
}

export default Sorcerer;
