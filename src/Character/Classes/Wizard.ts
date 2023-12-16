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
              label: 'A quarterstaff',
              armor: [],
              weapons: [getWeapon('Quarterstaff')],
              selections: [],
            },
            {
              label:  'A dagger',
              armor: [],
              weapons: [getWeapon('Dagger')],
              selections: [],
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
