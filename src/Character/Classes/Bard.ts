import { Abilities } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { WeaponType, getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Bard extends CharacterClass {
  constructor(level = 1) {
    super(
      'Bard', level, 8, [Abilities.charisma], [Abilities.dexterity, Abilities.charisma],
      ['Simple Weapons', 'Hand Crossbows', 'Longswords', 'Rapiers', 'Shortswords']
    )
  }

  clone(): Bard {
    return new Bard();
  }

  static startingEquipment(): StartingEquipment {
    return ({
      equipmentChoices: [
        {
          selection: 0,
          choices: [
            {
              label: 'A rapier',
              armor: [],
              weapons: [getWeapon('Rapier')],
              selections: []
            },
            {
              label:  'A Longsword',
              armor: [],
              weapons: [getWeapon('Longsword')],
              selections: []
            },
            {
              label:  'A simple weapon',
              armor: [],
              weapons: [getWeapon('Sickle')],
              selections: [[WeaponType.Simple, WeaponType.SimpleRange]]
            }
          ]
        },
      ],
      other: {
        label: 'Leather armor and a dagger',
        weapons: [getWeapon('Dagger')],
        armor: [getArmor('Leather')],
        selections: [],
      },
    })
  }
}

export default Bard;
