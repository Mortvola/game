import { Abilities } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Druid extends CharacterClass {
  constructor(level = 1) {
    super('Druid', level, 8, [Abilities.wisdom], [Abilities.intelligence, Abilities.wisdom])
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
              armor: [getArmor('Shield')],
              weapons: [],
            },
            {
              armor: [],
              weapons: [getWeapon('Dagger')],
            },
          ]
        },
        {
          selection: 0,
          choices: [
            {
              armor: [],
              weapons: [getWeapon('Scimitar')],
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
        armor: [getArmor('Leather')],
      },
    })
  }
}

export default Druid;
