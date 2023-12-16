import { Abilities } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { getWeapon } from "../Equipment/Weapon";
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
              armor: [getArmor('Shield')],
              weapons: [getWeapon('Longsword')],
            },
            {
              armor: [],
              weapons: [getWeapon('Longsword'), getWeapon('Halberd')],
            },
          ]
        },
        {
          selection: 0,
          choices: [
            {
              armor: [],
              weapons: [
                getWeapon('Javelin'),
                getWeapon('Javelin'),
                getWeapon('Javelin'),
                getWeapon('Javelin'),
                getWeapon('Javelin'),
              ],
            },
            {
              armor: [],
              weapons: [getWeapon('Dagger')],
            },
          ]
        },
      ],
      other: {
        weapons: [],
        armor: [getArmor('Chain mail')],
      },
    })
  }
}

export default Paladin;
