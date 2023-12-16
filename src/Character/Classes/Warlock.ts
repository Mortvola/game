import { Abilities } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { WeaponType, getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Warlock extends CharacterClass {
  constructor(level = 1) {
    super('Warlock', level, 8, [Abilities.charisma], [Abilities.wisdom, Abilities.charisma])
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
        weapons: [getWeapon('Dagger'), getWeapon('Dagger'), getWeapon('Handaxe')],
        armor: [getArmor('Leather')],
      },
    })
  }
}

export default Warlock;
