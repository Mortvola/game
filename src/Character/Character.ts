import { abilityModifier } from "../Dice";
import { AbilityScores, CharacterInterface, RaceInterface } from "../types";
import CharacterClass from "./Classes/CharacterClass";
import Creature from "./Creature";
import { Armor, ArmorType } from "./Equipment/Armor";
import { Weapon, WeaponType } from "./Equipment/Types";

class Character extends Creature implements CharacterInterface {
  constructor(abilityScores: AbilityScores, race: RaceInterface, charClass: CharacterClass, weapons: Weapon[], armor: Armor[]) {
    // const abilityScores = generateAbilityScores(rolls, race, charClass);

    const maxHitPoints = charClass.hitDice
      + abilityModifier(abilityScores.constitution)
      + race.hitPointBonus;

    super(abilityScores, maxHitPoints, race, charClass, weapons, armor, 0);

    this.equipped.meleeWeapon = this.weapons
      .filter((w) => [WeaponType.Simple, WeaponType.Martial].includes(w.type))[0];

    this.equipped.rangeWeapon = this.weapons
      .filter((w) => [WeaponType.SimpleRange, WeaponType.MartialRange].includes(w.type))[0];

    this.equipped.armor = this.armor
      .filter((a) => a.type !== ArmorType.Shield)[0];

    this.equipped.shield = this.armor
      .filter((a) => a.type === ArmorType.Shield)[0];

    this.name = race.generateName()
  }

  clone(): Creature {
    const raceCopy = this.race.clone();
    const classCopy = this.charClass.clone();

    const weaponsCopy = this.weapons.map((w) => w);
    const armorCopy = this.armor.map((a) => a);

    const copy = new Character(this.abilityScores, raceCopy, classCopy, weaponsCopy, armorCopy);

    copy.name = this.name;
    copy.abilityScores = this.abilityScores;
    copy.maxHitPoints = this.maxHitPoints;
    copy.hitPoints = this.hitPoints;
    copy.equipped = this.equipped;
    
    return copy;
  }
}

export default Character;
