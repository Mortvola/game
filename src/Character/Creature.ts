import { abilityModifier, getProficiencyBonus } from "../Dice";
import { clericSpellSlots, druidSpellSlots, wizardSpellSlots } from "../Tables";
import Action from "./Actions/Action";
import Condition, { ConditionType } from "./Actions/Conditions/Condition";
import Spell from "./Actions/Spells/Spell";
import { R, clericSpells, druidSpells } from "./Actions/Spells/Spells";
import CharacterClass from "./Classes/CharacterClass";
import { Armor } from "./Equipment/Armor";
import Weapon, { WeaponProperties, WeaponType } from "./Equipment/Weapon";
import { AbilityScores } from "./Races/AbilityScores";
import { Race } from "./Races/Race";

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

  temporaryHitPoints = 0;

  weapons: Weapon[];

  armor: Armor[];

  cantrips: R<Spell>[] = [];

  spells: R<Spell>[] = [];

  knownSpells: R<Spell>[] | null = null;

  actionsLeft = 0;

  bonusActionsLeft = 0;

  spellSlots: number[] = [];
  
  experiencePoints: number;

  equipped: Equipped = {
    meleeWeapon: null,
    rangeWeapon: null,
    armor: null,
    shield: null,
  }

  primaryWeapon: PrimaryWeapon = 'Melee';

  influencingActions: Action[] = [];

  conditions: Condition[] = [];

  concentration: Spell | null = null;

  enduringActions: Action[] = [];

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
    let ac = 0;

    if (this.hasInfluencingAction('Shield of Faith')) {
      ac += 2;      
    }

    if (this.equipped.armor) {
      ac += this.equipped.armor.armorClass + (this.equipped.shield?.armorClass ?? 0);

      if (this.equipped.armor.dexterityModifier) {
        let modifier = abilityModifier(this.abilityScores.dexterity);

        if (this.equipped.armor.maxModifier !== null) {
          modifier = Math.min(modifier, this.equipped.armor.maxModifier)
        }

        ac += modifier;
      }

      return ac;
    }
  
    if (this.hasInfluencingAction('Mage Armor')) {
      return ac + 13 + abilityModifier(this.abilityScores.dexterity)
    }

    return ac + this.charClass.unarmoredDefence(this.abilityScores);
  }

  hasCondition(name: ConditionType): boolean {
    return this.conditions.some((c) => c.name === name);
  }

  getCondition(name: ConditionType): Condition | undefined {
    return this.conditions.find((c) => c.name === name);
  }

  removeCondition(name: ConditionType): void {
    const index = this.conditions.findIndex((c) => c.name === name);

    if (index !== -1) {
      this.conditions = [
        ...this.conditions.slice(0, index),
        ...this.conditions.slice(index + 1),
      ]
    }
  }

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

  getMaxSpellSlots(spellLevel: number) {
    switch (this.charClass.name) {
      case 'Cleric':
        return clericSpellSlots[this.charClass.level - 1].spells[spellLevel - 1];

      case 'Wizard':
        return wizardSpellSlots[this.charClass.level - 1].spells[spellLevel - 1];

      case 'Druid':
        return druidSpellSlots[this.charClass.level - 1].spells[spellLevel - 1];
    }
  }

  getKnownSpells() {
    const isPrepared = (s: string) => {
      const result = this.spells.some(
          (ks) => {
            // console.log(`${ks.name}, ${s}`)
            return ks.name === s
          }
        )
      
      return result;
    }
  
    switch (this.charClass.name) {
      case 'Druid':
        return druidSpells[1].map((s) => ({
          spell: s,
          prepared: isPrepared(s.name)
        }))

      case 'Cleric':
        return clericSpells[1].map((s) => ({
          spell: s,
          prepared: isPrepared(s.name)
        }))

      case 'Wizard':
        if (this.knownSpells) {
          return this.knownSpells.map((s) => ({
            spell: s,
            prepared: isPrepared(s.name)
          }))  
        }

        break;
    }

    return [];
  }

  getMaxPreparedSpells(): number {
    switch (this.charClass.name) {
      case "Bard":
      case "Paladin":
      case "Sorcerer":
      case 'Warlock':
      case 'Druid':
      case 'Cleric':
      case 'Ranger':
      case 'Wizard':
        return 1 + abilityModifier(this.spellcastingAbilityScore);
    }

    return 0;
  }

  stopConcentrating() {
    if (this.concentration) {
      for (const creature of this.concentration.targets) {
        creature.character.removeInfluencingAction(this.concentration.name)
      }

      this.concentration = null;
    }
  }

  get spellcastingAbilityScore() {
    switch (this.charClass.name) {
      case "Bard":
      case "Paladin":
      case "Sorcerer":
      case 'Warlock':
          return this.abilityScores.charisma;

      case 'Druid':
      case 'Cleric':
      case 'Ranger':
        return this.abilityScores.wisdom;

      case 'Wizard':
        return this.abilityScores.intelligence;
    }

    return 0;
  }

  get spellCastingDc() {
    return 8 + getProficiencyBonus(this.charClass.level) + abilityModifier(this.spellcastingAbilityScore);
  }

  addInfluencingAction(spell: Action) {
    this.influencingActions.push(spell);
  }

  removeInfluencingAction(name: string) {
    const index = this.influencingActions.findIndex((s) => s.name === name);

    if (index !== -1) {
      this.influencingActions = [
        ...this.influencingActions.slice(0, index),
        ...this.influencingActions.slice(index + 1),
      ]
    }
  }

  hasInfluencingAction(name: string): boolean {
    return this.influencingActions.some((s) => s.name === name);
  }

  getInfluencingAction(name: string): Action | null {
    const spell = this.influencingActions.find((s) => s.name === name);

    return spell ?? null;
  }
}

export default Creature;
