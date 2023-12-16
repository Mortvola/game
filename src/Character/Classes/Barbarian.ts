import { Abilities, abilityModifier } from "../../Dice";
import { getWeapon } from "../Equipment/Weapon";
import { AbilityScores } from "../Races/AbilityScores";
import CharacterClass, { StartingEquipment } from "./CharacterClass";

class Barbarian extends CharacterClass {
  constructor(level = 1) {
    super('Barbarian', level, 12, [Abilities.strength, Abilities.constitution], [Abilities.strength, Abilities.constitution])
  }

  unarmoredDefence(abilityScores: AbilityScores) {
    return 10 + abilityModifier(abilityScores.dexterity) + abilityModifier(abilityScores.constitution)
  }

  clone(): Barbarian {
    return new Barbarian();
  }

  static startingEquipment(): StartingEquipment {
    return ({
      equipmentChoices: [
        {
          selection: 0,
          choices: [
            {
              armor: [],
              weapons: [getWeapon('Greataxe')],
            },
            {
              armor: [],
              weapons: [getWeapon('Shortsword')],
            }
          ]
        },
        {
          selection: 0,
          choices: [
            {
              weapons: [getWeapon('Handaxe'), getWeapon('Handaxe')],
              armor: [],
            },
            {
              weapons: [getWeapon('Shortbow')],
              armor: [],
            },
          ]
        },
      ],
      other: {
        weapons: [getWeapon('Javelin'), getWeapon('Javelin'), getWeapon('Javelin'), getWeapon('Javelin')],
        armor: [],
      },
    })
  }
}

export default Barbarian;
