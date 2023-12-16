import { Abilities } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Rogue extends CharacterClass {
  constructor(level = 1) {
    super('Rogue', level, 8, [Abilities.dexterity], [Abilities.dexterity, Abilities.intelligence])
  }

  clone(): Rogue {
    return new Rogue();
  }

  static startingEquipment(): StartingEquipment {
    return ({
      equipmentChoices: [
        {
          selection: 0,
          choices: [
            {
              armor: [],
              weapons: [getWeapon('Rapier')],
            },
            {
              armor: [],
              weapons: [getWeapon('Shortsword')],
            },
          ]
        },
        {
          selection: 0,
          choices: [
            {
              armor: [],
              weapons: [
                getWeapon('Shortbow'),
              ],
            },
            {
              armor: [],
              weapons: [
                getWeapon('Shortsword'),
              ],
            },
          ]
        },
      ],
      other: {
        weapons: [getWeapon('Dagger'), getWeapon('Dagger')],
        armor: [getArmor('Leather')],
      },
    })
  }
}

export default Rogue;
