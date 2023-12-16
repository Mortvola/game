import { Abilities } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Cleric extends CharacterClass {
  constructor(level = 1) {
    super('Cleric', level, 8, [Abilities.wisdom], [Abilities.wisdom, Abilities.charisma])
  }

  clone(): Cleric {
    return new Cleric();
  }

  static startingEquipment(): StartingEquipment {
    return ({
      equipmentChoices: [
        {
          selection: 0,
          choices: [
            {
              armor: [],
              weapons: [getWeapon('Mace')],
            },
            {
              armor: [],
              weapons: [getWeapon('Warhammer')],
            },
          ]
        },
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
            {
              armor: [getArmor('Chain mail')],
              weapons: [],
            },
          ]
        },
        {
          selection: 0,
          choices: [
            {
              armor: [],
              weapons: [getWeapon('Crossbow, light')],
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
        armor: [getArmor('Shield')],
      },
    })
  }
}

export default Cleric;
