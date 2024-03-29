import { Abilities } from "./Abilities";
import { getArmor } from "../Equipment/Armor";
import { getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Rogue extends CharacterClass {
  constructor(level = 1) {
    super(
      'Rogue', level, 8, [Abilities.dexterity], [Abilities.dexterity, Abilities.intelligence],
      ['Simple Weapons', 'Hand Crossbows', 'Longswords', 'Rapiers', 'Shortswords']
    )
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
              label: 'A rapier',
              armor: [],
              weapons: [getWeapon('Rapier')],
              selections: [],
            },
            {
              label: 'A shortsword',
              armor: [],
              weapons: [getWeapon('Shortsword')],
              selections: [],
            },
          ]
        },
        {
          selection: 0,
          choices: [
            {
              label: 'A shortbow & 20 arrows',
              armor: [],
              weapons: [
                getWeapon('Shortbow'),
              ],
              selections: [],
            },
            {
              label:  'A shortsword',
              armor: [],
              weapons: [
                getWeapon('Shortsword'),
              ],
              selections: [],
            },
          ]
        },
      ],
      other: {
        label: 'Leather armor and two daggers',
        weapons: [getWeapon('Dagger'), getWeapon('Dagger')],
        armor: [getArmor('Leather')],
        selections: [],
      },
    })
  }
}

export default Rogue;
