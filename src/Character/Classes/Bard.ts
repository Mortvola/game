import { Abilities } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Bard extends CharacterClass {
  constructor(level = 1) {
    super('Bard', level, 8, [Abilities.charisma], [Abilities.dexterity, Abilities.charisma])
  }

  clone(): Bard {
    return new Bard();
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
              weapons: [getWeapon('Longsword')],
            },
            {
              armor: [],
              weapons: [getWeapon('Sickle')],
            }
          ]
        },
      ],
      other: {
        weapons: [getWeapon('Dagger')],
        armor: [getArmor('Leather')],
      },
    })
  }
}

export default Bard;
