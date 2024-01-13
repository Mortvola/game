import { Vec2, Vec3, Vec4, Mat4 } from 'wgpu-matrix';

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

export interface CollideesInterface {
  detectCollision(p1 : Vec4, p2: Vec4, filter?: (actor: ActorInterface) => boolean): CollisionResult | null;
}

export interface WorldInterface {
  collidees: CollideesInterface;

  actors: ActorInterface[];

  participants: ParticipantsInterface;

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
  abilityScores: AbilityScores;

  charClass: CharacterClassInterface;

  get armorClass(): number;

  hasInfluencingAction(name: string): boolean;

  getAbilityModifier(weapon: Weapon): number;

  getWeaponProficiency(weapon: Weapon): number;

  addCondition(name: ConditionType): void;
}

export type Equipped = {
  meleeWeapon: Weapon | null,
  rangeWeapon: Weapon | null,
  armor: Armor | null,
  shield: Armor | null,
}

export interface ActionInterface {

}

export interface CharacterClassInterface {
  level: number;

  primaryAbilities: Abilities[];
}

export interface SpellInterface {

}

export interface CharacterInterface extends CreatureInterface {
  name: string;

  equipped: Equipped;

  enduringActions: ActionInterface[];

  spellSlots: number[];

  concentration: SpellInterface | null;

  get spellCastingDc();

  get spellcastingAbilityScore(): number;

  hitPoints: number;

  temporaryHitPoints: number;
  
  removeInfluencingAction(name: string): void;

  percentSuccess(target: CreatureInterface, weapon: Weapon): number;

  addInfluencingAction(spell: Action): void;

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

export interface CreatureActorInterface extends ActorInterface {
  id: number;

  attackRadius: number;

  occupiedRadius: number;

  distanceLeft: number;

  character: CharacterInterface;

  sceneNode: SceneNodeInterface;
  
  chestHeight: number;

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

export interface SceneNodeInterface {
  uuid: string;

  name: string;

  translate: Vec3;

  qRotate: Quat;

  angles: number[];

  scale: Vec3;

  allowedTransformations: AllowedTransformations;

  transform: Met4;

  computeTransform(transform: Mat4, prepend?: boolean): Mat4;
}

export interface DrawableNodeInterface extends SceneNodeInterface {
  drawable: DrawableInterface;

  pipeline: PipelineInterface;
  
  hitTest(origin: Vec4, vector: Vec4): { point: Vec4, t: number, drawable: DrawableInterface} | null;
}

export interface PipelineInterface {
  drawables: DrawableInterface[];

  addDrawable(drawable: DrawableNodeInterface): void;

  removeDrawable(drawable: DrawableNodeInterface): void;

  render(passEncoder: GPURenderPassEncoder): void;
}

export type PipelineAttributes = {

}

export interface PipelineManagerInterface {
  getPipelineByArgs(args: PipelineAttributes): Pipeline;
}

