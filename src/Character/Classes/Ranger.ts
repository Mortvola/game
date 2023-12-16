import { Abilities } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Ranger extends CharacterClass {
  constructor(level = 1) {
    super('Ranger', level, 10, [Abilities.dexterity, Abilities.wisdom], [Abilities.strength, Abilities.dexterity])
  }

  clone(): Ranger {
    return new Ranger();
  }

  static startingEquipment(): StartingEquipment {
    return ({
      equipmentChoices: [
        {
          selection: 0,
          choices: [
            {
              armor: [getArmor('Scale mail')],
              weapons: [],
            },
            {
              armor: [getArmor('Leather')],
              weapons: [],
            },
          ]
        },
        {
          selection: 0,
          choices: [
            {
              armor: [],
              weapons: [
                getWeapon('Shortsword'),
                getWeapon('Shortsword'),
              ],
            },
            {
              armor: [],
              weapons: [
                getWeapon('Dagger'),
                getWeapon('Handaxe'),
              ],
            },
          ]
        },
      ],
      other: {
        weapons: [getWeapon('Longbow')],
        armor: [],
      },
    })
  }
}

export default Ranger;
