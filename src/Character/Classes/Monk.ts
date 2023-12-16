import { Abilities, abilityModifier } from "../../Dice";
import { getArmor } from "../Equipment/Armor";
import { getWeapon } from "../Equipment/Weapon";
import { AbilityScores } from "../Races/AbilityScores";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Monk extends CharacterClass {
  constructor(level = 1) {
    super('Monk', level, 8, [Abilities.dexterity, Abilities.wisdom], [Abilities.strength, Abilities.dexterity])
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
              armor: [],
              weapons: [getWeapon('Shortsword')],
            },
            {
              armor: [],
              weapons: [getWeapon('Dagger')],
            },
          ]
        },
      ],
      other: {
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
      },
    })
  }
}

export default Monk;
