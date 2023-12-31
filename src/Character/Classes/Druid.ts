import { Abilities } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { WeaponType, getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Druid extends CharacterClass {
  constructor(level = 1) {
    super(
      'Druid', level, 8, [Abilities.wisdom], [Abilities.intelligence, Abilities.wisdom],
      ['Clubs', 'Daggers', 'Darts', 'Javelins', 'Maces', 'Quarterstaffs', 'Scimitars', 'Sickles', 'Slings', 'Spears']
    )
  }

  clone(): Druid {
    return new Druid();
  }

  static startingEquipment(): StartingEquipment {
    return ({
      equipmentChoices: [
        {
          selection: 0,
          choices: [
            {
              label: 'A wooden shield',
              armor: [getArmor('Shield')],
              weapons: [],
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
        {
          selection: 0,
          choices: [
            {
              label: 'A scimitar',
              armor: [],
              weapons: [getWeapon('Scimitar')],
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
        label: 'Leather armor',
        weapons: [],
        armor: [getArmor('Leather')],
        selections: [],
      },
    })
  }
}

export default Druid;
