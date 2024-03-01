import { Vec4 } from "wgpu-matrix";
import { abilityModifier, getProficiencyBonus } from "../Dice";
import { clericSpellSlots, druidSpellSlots, wizardSpellSlots } from "../Tables";
import { ConditionType } from "./Actions/Conditions/Condition";
import Spell from "./Actions/Spells/Spell";
import { clericSpells, druidSpells } from "./Actions/Spells/Spells";
import CharacterClass from "./Classes/CharacterClass";
import { Armor } from "./Equipment/Armor";
import { AbilityScores, ActionInterface, CreatureActorInterface, CreatureInterface, Equipped, PrimaryWeapon, SpellFactory, RaceInterface } from "../types";
import { Weapon, WeaponProperties, WeaponType } from "./Equipment/Types";
import { makeObservable, observable } from "mobx";

class Creature implements CreatureInterface {
  name = '';

  race: RaceInterface;

  charClass: CharacterClass;

  abilityScores: AbilityScores;

  maxHitPoints: number;

  hitPoints: number;

  temporaryHitPoints = 0;

  weapons: Weapon[];

  armor: Armor[];

  cantrips: SpellFactory<Spell>[] = [];

  spells: SpellFactory<Spell>[] = [];

  knownSpells: SpellFactory<Spell>[] | null = null;

  actionsLeft = 0;

  bonusActionsLeft = 0;

  spellSlots: number[] = [];
  
  experiencePoints: number;

  actor: CreatureActorInterface | null = null;

  equipped: Equipped = {
    meleeWeapon: null,
    rangeWeapon: null,
    armor: null,
    shield: null,
  }

  primaryWeapon: PrimaryWeapon = 'Melee';

  influencingActions: ActionInterface[] = [];

  conditions: ConditionType[] = [];

  concentration: Spell | null = null;

  enduringActions: ActionInterface[] = [];

  constructor(
    abilityScores: AbilityScores,
    maxHitPoints: number,
    race: RaceInterface,
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

    makeObservable(this, {
      spellSlots: observable,
      actionsLeft: observable,
      bonusActionsLeft: observable,
      // equipped: observable,
    })

    makeObservable(this.equipped, {
      meleeWeapon: observable,
      rangeWeapon: observable,
    })
  }

  clone(): Creature {
    throw new Error('not implemented')
  }

  get armorClass(): number {
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

  addCondition(name: ConditionType) {
    if (!this.conditions.includes(name)) {
      this.conditions.push(name)
    }
  }

  hasCondition(name: ConditionType): boolean {
    return this.conditions.some((c) => c === name);
  }

  // getCondition(name: ConditionType): ConditionType | undefined {
  //   return this.conditions.find((c) => c === name);
  // }

  removeCondition(name: ConditionType): void {
    const index = this.conditions.findIndex((c) => c === name);

    if (index !== -1) {
      this.conditions = [
        ...this.conditions.slice(0, index),
        ...this.conditions.slice(index + 1),
      ]
    }
  }

  getWeaponProficiency(weapon: Weapon): number {
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

  getMaxSpellSlots(spellLevel: number): number | undefined {
    switch (this.charClass.name) {
      case 'Cleric':
        return clericSpellSlots[this.charClass.level - 1].spells[spellLevel - 1];

      case 'Wizard':
        return wizardSpellSlots[this.charClass.level - 1].spells[spellLevel - 1];

      case 'Druid':
        return druidSpellSlots[this.charClass.level - 1].spells[spellLevel - 1];
    }

    return undefined;
  }

  getMaxSpellLevel(): number | undefined {
    switch (this.charClass.name) {
      case 'Cleric':
        return clericSpellSlots[this.charClass.level - 1].spells.length;

      case 'Wizard':
        return wizardSpellSlots[this.charClass.level - 1].spells.length;

      case 'Druid':
        return druidSpellSlots[this.charClass.level - 1].spells.length;
    }

    return undefined;
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

  get spellcastingAbilityScore(): number {
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

  get spellCastingDc(): number {
    return 8 + getProficiencyBonus(this.charClass.level) + abilityModifier(this.spellcastingAbilityScore);
  }

  addInfluencingAction(spell: ActionInterface) {
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

  getInfluencingAction(name: string): ActionInterface | null {
    const spell = this.influencingActions.find((s) => s.name === name);

    return spell ?? null;
  }

  getWorldPosition(): Vec4 {
    if (!this.actor) {
      throw new Error('actor not set')
    }

    return this.actor.getWorldPosition();
  }
}

export default Creature;
