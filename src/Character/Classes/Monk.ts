import { Abilities } from "./Abilities";
import { abilityModifier } from "../../Dice";
import { AbilityScores } from "../../types";
import { WeaponType, getWeapon } from "../Equipment/Weapon";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Monk extends CharacterClass {
  constructor(level = 1) {
    super(
      'Monk', level, 8, [Abilities.dexterity, Abilities.wisdom], [Abilities.strength, Abilities.dexterity],
      ['Simple Weapons', 'Shortswords']
    )
  }

  unarmoredDefence(abilityScores: AbilityScores) {
    return 10 + abilityModifier(abilityScores.dexterity) + abilityModifier(abilityScores.wisdom)
  }

  clone(): Monk {
    return new Monk();
  }

  static startingEquipment(): StartingEquipment {
    return ({
      equipmentChoices: [
        {
          selection: 0,
          choices: [
            {
              label: 'A shortsword',
              armor: [],
              weapons: [getWeapon('Shortsword')],
              selections: []
            },
            {
              label:  'A simple weapon',
              armor: [],
              weapons: [getWeapon('Dagger')],
              selections: [[WeaponType.Simple, WeaponType.SimpleRange]]
            },
          ]
        },
      ],
      other: {
        label: '10 darts',
        weapons: [
          getWeapon('Dart'),
          getWeapon('Dart'),
          getWeapon('Dart'),
          getWeapon('Dart'),
          getWeapon('Dart'),
          getWeapon('Dart'),
          getWeapon('Dart'),
          getWeapon('Dart'),
          getWeapon('Dart'),
          getWeapon('Dart'),
        ],
        armor: [],
        selections: [],
      },
    })
  }
}

export default Monk;
