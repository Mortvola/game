import { abilityModifier, getProficiencyBonus } from "../Dice";
import { KnownSpell } from "../UserInterface/AddCharacter/Spells/KnownSpell";
import { Action } from "./Actions/Action";
import CharacterClass from "./Classes/CharacterClass";
import { Armor } from "./Equipment/Armor";
import Weapon, { WeaponProperties, WeaponType } from "./Equipment/Weapon";
import { AbilityScores } from "./Races/AbilityScores";
import { Race } from "./Races/Race";
import Spell from "./Actions/Spells/Spell";

export type Equipped = {
  meleeWeapon: Weapon | null,
  rangeWeapon: Weapon | null,
  armor: Armor | null,
  shield: Armor | null,
}

type PrimaryWeapon = 'Melee' | 'Range';
  
class Creature {
  name = '';

  race: Race;

  charClass: CharacterClass;

  abilityScores: AbilityScores;

  maxHitPoints: number;

  hitPoints: number;

  weapons: Weapon[];

  armor: Armor[];

  spells: KnownSpell[] = [];

  action: Spell | null = null;

  experiencePoints: number;

  equipped: Equipped = {
    meleeWeapon: null,
    rangeWeapon: null,
    armor: null,
    shield: null,
  }

  defaultAction: Action | null = null;
  
  constructor(
    abilityScores: AbilityScores,
    maxHitPoints: number,
    race: Race,
    charClass: CharacterClass,
    weapons: Weapon[],
    armor: Armor[],
    experiencePoints: number,
  ) {
    this.abilityScores = abilityScores;
    this.maxHitPoints = maxHitPoints;
    this.hitPoints = maxHitPoints;
    this.race = race;
    this.charClass = charClass;
    this.weapons = weapons;
    this.armor = armor;
    this.experiencePoints = experiencePoints;
  }

  clone(): Creature {
    throw new Error('not implemented')
  }

  get armorClass() {
    if (this.equipped.armor) {
      let ac = this.equipped.armor.armorClass + (this.equipped.shield?.armorClass ?? 0);

      if (this.equipped.armor.dexterityModifier) {
        let modifier = abilityModifier(this.abilityScores.dexterity);

        if (this.equipped.armor.maxModifier !== null) {
          modifier = Math.min(modifier, this.equipped.armor.maxModifier)
        }

        ac += modifier;
      }

      return ac;
    }
  
    return this.charClass.unarmoredDefence(this.abilityScores);
  };

  getWeaponProficiency(weapon: Weapon) {
    if (this.charClass.weaponProficiencies.filter((wp) => weapon.proficiencies.includes(wp)).length > 0) {
      return getProficiencyBonus(this.charClass.level)
    }
    
    return 0;
  }

  getAbilityModifier(weapon: Weapon): number {
    let abilityScore = this.abilityScores.strength;
  
    if (
      [WeaponType.MartialRange, WeaponType.SimpleRange].includes(weapon.type)
      || (weapon.properties.includes(WeaponProperties.Finesse)
      && this.abilityScores.dexterity > this.abilityScores.strength)
    ) {
      abilityScore = this.abilityScores.dexterity;
    }
  
    return abilityModifier(abilityScore);
  }

  percentSuccess(target: Creature, weapon: Weapon): number {
    return Math.min(Math.max(100 - (target.armorClass
      - this.getAbilityModifier(weapon)
      - this.getWeaponProficiency(weapon))
      * 5, 5), 95)
  }
}

export default Creature;
