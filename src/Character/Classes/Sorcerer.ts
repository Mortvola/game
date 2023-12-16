import { Abilities } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Sorcerer extends CharacterClass {
  constructor(level = 1) {
    super('Sorcerer', level, 6, [Abilities.charisma], [Abilities.constitution, Abilities.charisma])
  }

  clone(): Sorcerer {
    return new Sorcerer();
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
        weapons: [getWeapon('Dagger'), getWeapon('Dagger')],
        armor: [],
      },
    })
  }
}

export default Sorcerer;
