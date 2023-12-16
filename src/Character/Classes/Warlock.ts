import { Abilities } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { getWeapon } from "../Equipment/Weapon";
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
        weapons: [getWeapon('Dagger'), getWeapon('Dagger'), getWeapon('Handaxe')],
        armor: [getArmor('Leather')],
      },
    })
  }
}

export default Warlock;
