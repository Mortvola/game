import { Abilities } from "./Abilities";
import { getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Wizard extends CharacterClass {
  constructor(level = 1) {
    super(
      'Wizard', level, 6, [Abilities.intelligence], [Abilities.intelligence, Abilities.wisdom],
      ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light Crossbows']
    )
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
        label: '',
        weapons: [],
        armor: [],
        selections: [],
      },
    })
  }
}

export default Wizard;
