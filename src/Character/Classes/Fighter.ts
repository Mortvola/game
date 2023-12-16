import { Abilities } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Fighter extends CharacterClass {
  constructor(level = 1) {
    super('Fighter', level, 10, [Abilities.strength, Abilities.constitution], [Abilities.strength, Abilities.constitution])
  }

  clone(): Fighter {
    return new Fighter();
  }

  static startingEquipment(): StartingEquipment {
    return ({
      equipmentChoices: [
        {
          selection: 0,
          choices: [
            {
              armor: [getArmor('Chain mail')],
              weapons: [],
            },
            {
              armor: [getArmor('Leather')],
              weapons: [getWeapon('Longbow')],
            }
          ]
        },
        {
          selection: 0,
          choices: [
            {
              weapons: [getWeapon('Shortsword')],
              armor: [getArmor('Shield')],
            },
            {
              weapons: [getWeapon('Shortsword'), getWeapon('Warhammer')],
              armor: [],
            },
          ]
        },
        {
          selection: 0,
          choices: [
            {
              weapons: [getWeapon('Crossbow, light')],
              armor: [],
            },
            {
              weapons: [getWeapon('Handaxe'), getWeapon('Handaxe')],
              armor: [],
            },
          ]
        },
      ],
      other: { weapons: [], armor: [] },
    })
  }
}

export default Fighter;
