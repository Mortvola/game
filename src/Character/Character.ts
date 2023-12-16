import { abilityModifier, generateAbilityScores } from "../Dice";
import CharacterClass from "./Classes/CharacterClass";
import { Armor, ArmorType } from "./Equipment/Armor";
import Weapon, { WeaponType } from "./Equipment/Weapon";
import { AbilityScores } from "./Races/AbilityScores";
import { Race } from "./Races/Race";

type Equipped = {
  meleeWeapon: Weapon | null,
  rangeWeapon: Weapon | null,
  armor: Armor | null,
  shield: Armor | null,
}

class Character {
  name: string;

  race: Race;

  charClass: CharacterClass;

  abilityScores: AbilityScores;

  maxHitPoints: number;

  hitPoints: number;

  weapons: Weapon[];

  armor: Armor[];

  equipped: Equipped = {
    meleeWeapon: null,
    rangeWeapon: null,
    armor: null,
    shield: null,
  }

  constructor(race: Race, charClass: CharacterClass, weapons: Weapon[], armor: Armor[]) {
    this.race = race;
    this.charClass = charClass;

    this.weapons = weapons;
    this.armor = armor;

    this.equipped.meleeWeapon = this.weapons
      .filter((w) => [WeaponType.Simple, WeaponType.Martial].includes(w.type))[0];

    this.equipped.rangeWeapon = this.weapons
      .filter((w) => [WeaponType.SimpleRange, WeaponType.MartialRange].includes(w.type))[0];

    this.equipped.armor = this.armor
      .filter((a) => a.type !== ArmorType.Shield)[0];

    this.equipped.shield = this.armor
      .filter((a) => a.type === ArmorType.Shield)[0];

    this.name = race.generateName()

    this.abilityScores = generateAbilityScores(this.race, this.charClass)

    this.maxHitPoints = this.charClass.hitDice
      + abilityModifier(this.abilityScores.constitution)
      + this.race.hitPointBonus;

    this.hitPoints = this.maxHitPoints;
  }

  clone(): Character {
    const raceCopy = this.race.clone();
    const classCopy = this.charClass.clone();

    const weaponsCopy = this.weapons.map((w) => w);
    const armorCopy = this.armor.map((a) => a);

    const copy = new Character(raceCopy, classCopy, weaponsCopy, armorCopy);

    copy.name = this.name;
    copy.abilityScores = this.abilityScores;
    copy.maxHitPoints = this.maxHitPoints;
    copy.hitPoints = this.hitPoints;
    copy.equipped = this.equipped;
    
    return copy;
  }

  get armorClass() {
    if (this.equipped.armor) {
      return this.equipped.armor.armorClass + (this.equipped.shield?.armorClass ?? 0);
    }
  
    return this.charClass.unarmoredDefence(this.abilityScores);
  };
}

export default Character;
