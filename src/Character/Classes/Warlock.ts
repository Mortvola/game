import { Abilities } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { WeaponType, getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Warlock extends CharacterClass {
  constructor(level = 1) {
    super(
      'Warlock', level, 8, [Abilities.charisma], [Abilities.wisdom, Abilities.charisma],
      ['Simple Weapons']
    )
  }

  clone(): Warlock {
    return new Warlock();
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
              label: 'A simple weapon',
              armor: [],
              weapons: [getWeapon('Dagger')],
              selections: [[WeaponType.Simple, WeaponType.SimpleRange]],
            },
          ]
        },
      ],
      other: {
        label: 'Leather armor, two daggers and a simple weapon',
        weapons: [getWeapon('Handaxe'), getWeapon('Dagger'), getWeapon('Dagger')],
        armor: [getArmor('Leather')],
        selections: [[WeaponType.Simple, WeaponType.SimpleRange]],
      },
    })
  }
}

export default Warlock;
