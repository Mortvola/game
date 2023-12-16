import { Abilities } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { WeaponType, getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Ranger extends CharacterClass {
  constructor(level = 1) {
    super('Ranger', level, 10, [Abilities.dexterity, Abilities.wisdom], [Abilities.strength, Abilities.dexterity])
  }

  clone(): Ranger {
    return new Ranger();
  }

  static startingEquipment(): StartingEquipment {
    return ({
      equipmentChoices: [
        {
          selection: 0,
          choices: [
            {
              label: 'Scale mail',
              armor: [getArmor('Scale mail')],
              weapons: [],
              selections: [],
            },
            {
              label:  'Leather armor',
              armor: [getArmor('Leather')],
              weapons: [],
              selections: [],
            },
          ]
        },
        {
          selection: 0,
          choices: [
            {
              label: 'Two shortswords',
              armor: [],
              weapons: [
                getWeapon('Shortsword'),
                getWeapon('Shortsword'),
              ],
              selections: [],
            },
            {
              label:  'Two simple melee weapons',
              armor: [],
              weapons: [
                getWeapon('Dagger'),
                getWeapon('Handaxe'),
              ],
              selections: [[WeaponType.Simple], [WeaponType.Simple]],
            },
          ]
        },
      ],
      other: {
        label: 'A longbow & 20 arrows',
        weapons: [getWeapon('Longbow')],
        armor: [],
        selections: [],
      },
    })
  }
}

export default Ranger;
