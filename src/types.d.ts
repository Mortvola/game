import Participants from "./Participants";
import { SceneNodeInterface } from "./Drawables/SceneNodes/SceneNodeInterface";
import { ShotData } from "./Script/Shot";

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

export interface WorldInterface {
  collidees: Collidees;

  actors: ActorInterface[];

  participants: Participants;

  scene: ContainerNode;

  animate: boolean;
  
  endTurn2(actor: ActorInterface): void;

  removeActors: ActorInterface[];

  mainRenderPass: RenderPass;

  loggerCallback: ((message: string) => void) | null;

  path2: Line | null;

  path3: Line | null;

  path4: Line | null;

  occupants: Occupant[];

  focused: Actor | null;

  focusCallback: ((focusInfo: FocusInfo | null) => void) | null;

  actionInfoCallback: ((actionInfo: ActionInfo | null) => void) | null;
}

export type ActorOnFinishCallback = (timestamp: number) => void;

export interface ActorInterface {
  update(elapsedTime: number, timestamp: number, world: WorldInterface): Promise<boolean>;
}

export interface CreatureInterface {
}

export type Equipped = {
  meleeWeapon: Weapon | null,
  rangeWeapon: Weapon | null,
  armor: Armor | null,
  shield: Armor | null,
}

export interface ActionInterface {

}

export interface CHaracterClassInterface {
  level: number;
}

export interface CharacterInterface {
  name: string;

  equipped: Equipped;

  enduringActions: ActionInterface[];

  spellSlots: number[];

  abilityScores: AbilityScores;

  concentration: Spell | null;

  get spellCastingDc();

  get spellcastingAbilityScore(): number;

  charClass: CHaracterClassInterface;

  get armorClass(): number;

  temporaryHitPoints: number;
  
  removeInfluencingAction(name: string): void;

  percentSuccess(target: CreatureInterface, weapon: Weapon): number;

  addInfluencingAction(spell: Action): void;

  hasInfluencingAction(name: string): boolean;

  stopConcentrating(): void;
}

export interface CreatureActorInterface extends ActorInterface {
  id: number;

  attackRadius: number;

  occupiedRadius: number;

  distanceLeft: number;

  character: CharacterInterface;

  sceneNode: SceneNodeInterface;
  
  getWorldPosition(): Vec4;

  processPath(path: PathPoint[], script: Script): PathPoint[];

  attack(
    targetActor: Actor,
    weapon: Weapon,
    world: WorldInterface,
    script: Script,
  ): void;

  computeShotData(targetActor: Actor): ShotData;

  takeDamage(damage: number, critical: boolean, from: Actor, weaponName: string, script: Script);

  takeHealing(hitPoints: number, from: Actor, by: string, script: Script);
}

