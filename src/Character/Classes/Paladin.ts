import { Abilities } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { WeaponType, getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Paladin extends CharacterClass {
  constructor(level = 1) {
    super('Paladin', level, 10, [Abilities.strength, Abilities.charisma], [Abilities.wisdom, Abilities.charisma])
  }

  clone(): Paladin {
    return new Paladin();
  }

  static startingEquipment(): StartingEquipment {
    return ({
      equipmentChoices: [
        {
          selection: 0,
          choices: [
            {
              label: 'A martial weapon & shield',
              armor: [getArmor('Shield')],
              weapons: [getWeapon('Longsword')],
              selections: [[WeaponType.Martial, WeaponType.MartialRange]],
            },
            {
              label:  'Two martial weapons',
              armor: [],
              weapons: [getWeapon('Longsword'), getWeapon('Halberd')],
              selections: [[WeaponType.Martial, WeaponType.MartialRange], [WeaponType.Martial, WeaponType.MartialRange]]
            },
          ]
        },
        {
          selection: 0,
          choices: [
            {
              label: 'Five javelins',
              armor: [],
              weapons: [
                getWeapon('Javelin'),
                getWeapon('Javelin'),
                getWeapon('Javelin'),
                getWeapon('Javelin'),
                getWeapon('Javelin'),
              ],
              selections: []
            },
            {
              label:  'A simple melee weapon',
              armor: [],
              weapons: [getWeapon('Dagger')],
              selections: [[WeaponType.Simple]]
            },
          ]
        },
      ],
      other: {
        label: 'Chain mail',
        weapons: [],
        armor: [getArmor('Chain mail')],
        selections: [],
      },
    })
  }
}

export default Paladin;
