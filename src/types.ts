import { Vec2, Vec3, Vec4 } from 'wgpu-matrix';
import { Occupant, PathPoint } from './Workers/PathPlannerTypes';
import { ConditionType } from './Character/Actions/Conditions/Condition';
import { Armor } from './Character/Equipment/Armor';
import { Abilities } from './Character/Classes/Abilities';
import DrawableInterface from './Renderer/Drawables/DrawableInterface';
import { Weapon } from './Character/Equipment/Types';
import { feetToMeters } from './Renderer/Math';
import { SceneObjectInterface } from './Renderer/types';
import { RendererInterface } from './Renderer/types';

export const maxInstances = 16;

export type EpisodeInfo = {
  winningTeam: number,
}

export type ShotData = {
  velocityVector: Vec2,
  startPos: Vec3,
  position: Vec4,
  orientation: Vec4,
  distance: number,
  duration?: number,
};

export type ActionInfo = {
  action: string,
  description?: string,
  percentSuccess: number | null,
}

export type FocusInfo = {
  name: string,
  hitpoints: number,
  temporaryHitpoints: number,
  maxHitpoints: number,
  armorClass: number,
  conditions: { name: string, duration: number }[],
}

// export type Delay = {
//   startTime: number,
//   duration: number,
//   onFinish: ((timestamp: number) => void) | null,
// }

export interface ParticipantsInterface {
  participants: CreatureActorInterface[][];

  turns: CreatureActorInterface[];

  get activeActor(): CreatureActorInterface;
}

export type CollisionResult = {
  actor: CreatureActorInterface,
  point: Vec4,
}

export interface CollideesInterface {
  detectCollision(p1 : Vec4, p2: Vec4, filter?: (actor: ActorInterface) => boolean): CollisionResult | null;
}

export interface WorldInterface {
  renderer: RendererInterface;

  collidees: CollideesInterface;

  actors: ActorInterface[];

  participants: ParticipantsInterface;

  // scene: ContainerNodeInterface;

  animate: boolean;
  
  endTurn2(actor: ActorInterface): void;

  removeActors: ActorInterface[];

  // mainRenderPass: RenderPassInterface;

  loggerCallback: ((message: string) => void) | null;

  path2: DrawableInterface | null;

  path3: DrawableInterface | null;

  path4: DrawableInterface | null;

  occupants: Occupant[];

  focused: CreatureActorInterface | null;

  focusCallback: ((focusInfo: FocusInfo | null) => void) | null;

  actionInfoCallback: ((actionInfo: ActionInfo | null) => void) | null;
}

export type ActorOnFinishCallback = (timestamp: number) => void;

export interface ActorInterface {
  update(elapsedTime: number, timestamp: number): Promise<boolean>;

  world: WorldInterface,
}

export interface CreatureInterface {
  name: string;

  abilityScores: AbilityScores;

  charClass: CharacterClassInterface;

  race: RaceInterface;

  get armorClass(): number;

  experiencePoints: number;

  weapons: Weapon[];

  armor: Armor[];

  knownSpells: SpellFactory<SpellInterface>[] | null;

  hasInfluencingAction(name: string): boolean;

  getInfluencingAction(name: string): ActionInterface | null

  getAbilityModifier(weapon: Weapon): number;

  getWeaponProficiency(weapon: Weapon): number;

  addCondition(name: ConditionType): void;

  hasCondition(name: ConditionType): boolean;

  removeCondition(name: ConditionType): void;

  getKnownSpells(): { spell: SpellFactory<SpellInterface>, prepared: boolean }[];

  getMaxPreparedSpells(): number;
}

export type Equipped = {
  meleeWeapon: Weapon | null,
  rangeWeapon: Weapon | null,
  armor: Armor | null,
  shield: Armor | null,
}

export type TimeType = 'Action' | 'Bonus' | 'Move';

export interface ActionInterface {
  actor: CreatureActorInterface;

  name: string;

  duration: number;

  time: TimeType;

  endOfTurn: boolean;

  targets: CreatureActorInterface[];

  initialize(): void;

  clear(): void;

  prepareInteraction(target: CreatureActorInterface | null, point: Vec4 | null): Promise<void>;

  interact(script: ScriptInterface): Promise<boolean>;
}

export type A<T> = {
  action: new (actor: CreatureActorInterface) => T;
  name: string;
  time: TimeType,
}

export enum Size {
  Tiny = feetToMeters(2.5),
  Small = feetToMeters(5),
  Medium = feetToMeters(5),
  Large = feetToMeters(10),
  Huge = feetToMeters(15),
  Gargantuan = feetToMeters(20),
}

export interface RaceInterface {
  name: string;
  
  speed: number;

  abilityIncrease: AbilityScores;

  hitPointBonus: number;
  
  size: Size;

  height: number;

  generateName(): string;

  clone(): RaceInterface;
}

export interface CharacterClassInterface {
  name: string;

  level: number;

  primaryAbilities: Abilities[];

  actions: ActionFactory<ActionInterface>[];
}

export interface SpellInterface extends ActionInterface {

}

export class ActionFactory<T extends ActionInterface> {
  actionConstructor: new (actor: CreatureActorInterface) => T;
  name: string;
  time: TimeType

  action: ActionInterface | null = null

  constructor(actionConstructor: new (actor: CreatureActorInterface) => T, name: string, time: TimeType) {
    this.actionConstructor = actionConstructor
    this.name = name
    this.time = time
  }

  initialize(actor: CreatureActorInterface) {
    this.action = new this.actionConstructor(actor)
    this.action.initialize()
  }

  available(actor: CreatureActorInterface) {
    return (((this.time === 'Action' && actor.character.actionsLeft > 0)
    || (this.time === 'Bonus' && actor.character.bonusActionsLeft > 0)))
  }
}

export class SpellFactory<T extends ActionInterface = any> extends ActionFactory<T> {
  level: number

  constructor(action: new (actor: CreatureActorInterface) => T, name: string, time: TimeType, level: number) {
    super(action, name, time)
    this.level = level
  }

  available(actor: CreatureActorInterface) {
    return (((this.time === 'Action' && actor.character.actionsLeft > 0)
    || (this.time === 'Bonus' && actor.character.bonusActionsLeft > 0))
    && (this.level === 0 || actor.character.spellSlots[this.level - 1] > 0))
  }
}

export type PrimaryWeapon = 'Melee' | 'Range';
  
export interface CharacterInterface extends CreatureInterface {
  equipped: Equipped;

  enduringActions: ActionInterface[];

  spellSlots: number[];

  concentration: SpellInterface | null;

  get spellCastingDc(): number;

  get spellcastingAbilityScore(): number;

  spells: SpellFactory<SpellInterface>[];

  cantrips: SpellFactory<SpellInterface>[]

  hitPoints: number;

  maxHitPoints: number;

  temporaryHitPoints: number;
  
  influencingActions: ActionInterface[];

  conditions: ConditionType[];

  actionsLeft: number;

  bonusActionsLeft: number;

  primaryWeapon: PrimaryWeapon;

  actor: CreatureActorInterface | null;

  getMaxSpellSlots(spellLevel: number): number;

  getMaxSpellLevel(): number;

  removeInfluencingAction(name: string): void;

  percentSuccess(target: CreatureInterface, weapon: Weapon): number;

  addInfluencingAction(spell: ActionInterface): void;

  stopConcentrating(): void;
}

export type AbilityScores = {
  charisma: number,
  constitution: number,
  dexterity: number,
  intelligence: number,
  strength: number,
  wisdom: number,
}

export interface ScriptInterface {

}

export enum States {
  idle,
  planning,
  scripting,
}

export interface CreatureActorInterface extends ActorInterface {
  id: number;

  attackRadius: number;

  occupiedRadius: number;

  distanceLeft: number;

  character: CharacterInterface;

  sceneObject: SceneObjectInterface

  chestHeight: number;

  team: number;

  initiativeRoll: number;

  automated: boolean;

  state: States;

  startTurn(): void;

  endTurn(): void;

  setAction(action: ActionFactory<ActionInterface> | null): void;

  setDefaultAction(): void;

  setMoveAction(): void;

  getAction(): ActionFactory<ActionInterface> | null;

  getWorldPosition(): Vec4;

  processPath(path: PathPoint[], script: ScriptInterface): PathPoint[];

  attack(
    targetActor: CreatureActorInterface,
    weapon: Weapon,
    script: ScriptInterface,
  ): void;

  computeShotData(targetActor: CreatureActorInterface): ShotData;

  takeDamage(damage: number, critical: boolean, from: CreatureActorInterface, weaponName: string, script: ScriptInterface): void;

  takeHealing(hitPoints: number, from: CreatureActorInterface, by: string, script: ScriptInterface): void;
}

export type Party = {
  members: { included: boolean, character: CharacterInterface }[],
  automate: boolean,
  experiencePoints?: number,
}
