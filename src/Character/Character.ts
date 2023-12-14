import { abilityModifier, generateAbilityScores } from "../Dice";
import CharacterClass from "./Classes/CharacterClass";
import { getWeapon } from "./Equipment/Weapon";
import { AbilityScores } from "./Races/AbilityScores";
import { Race } from "./Races/Race";

class Character {
  name: string;

  race: Race;

  charClass: CharacterClass;

  abilityScores: AbilityScores;

  maxHitPoints: number;

  hitPoints: number;

  weapon = getWeapon('Shortbow');

  constructor(race: Race, charClass: CharacterClass) {
    this.race = race;
    this.charClass = charClass;

    this.name = race.generateName()

    this.abilityScores = generateAbilityScores(this.race, this.charClass)

    this.maxHitPoints = this.charClass.hitDice + abilityModifier(this.abilityScores.constitution);
    this.hitPoints = this.maxHitPoints;
  }

  clone(): Character {
    const raceCopy = this.race.clone();
    const classCopy = this.charClass.clone();

    const copy = new Character(raceCopy, classCopy);

    copy.name = this.name;
    copy.abilityScores = this.abilityScores;
    copy.maxHitPoints = this.maxHitPoints;
    copy.hitPoints = this.hitPoints;
    copy.weapon = this.weapon;
    
    return copy;
  }

  get armorClass() {
    return this.charClass.unarmoredDefence(this.abilityScores);
  };
}

export default Character;
