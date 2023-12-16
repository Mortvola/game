import { Abilities } from "../../Dice";
import { getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Wizard extends CharacterClass {
  constructor(level = 1) {
    super('Wizard', level, 6, [Abilities.intelligence], [Abilities.intelligence, Abilities.wisdom])
  }

  clone(): Wizard {
    return new Wizard();
  }

  static startingEquipment(): StartingEquipment {
    return ({
      equipmentChoices: [
        {
          selection: 0,
          choices: [
            {
              armor: [],
              weapons: [getWeapon('Quarterstaff')],
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
        armor: [],
      },
    })
  }
}

export default Wizard;
