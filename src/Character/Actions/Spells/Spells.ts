import { TimeType } from "../Action";
import AcidSplash from "./AcidSplash";
import Bane from "./Bane";
import BladeWard from "./BladeWard";
import Bless from "./Bless";
import BurningHands from "./BurningHands";
import CharmPerson from "./CharmPerson";
import ChillTouch from "./ChillTouch";
import ChromaticOrb from "./ChromaticOrb";
import ColorSpray from "./ColorSpray";
import CureWounds from "./CureWounds";
import Entangle from "./Entangle";
import ExpeditiousRetreat from "./ExpeditiousRetreat";
import FaerieFire from "./FaerieFire";
import FalseLife from "./FalseLife";
import FireBolt from "./FireBolt";
import FogCloud from "./FogCloud";
import Goodberry from "./Goodberry";
import Grease from "./Grease";
import Guidance from "./Guidance";
import GuidingBolt from "./GuidingBolt";
import HealingWord from "./HealingWord";
import InflictWounds from "./InflictWounds";
import Jump from "./Jump";
import Light from "./LIght";
import Longstrider from "./Longstrider";
import MageArmor from "./MageArmor";
import MagicMissile from './MagicMissile'
import PoisonSpray from "./PoisonSpray";
import ProduceFlame from "./ProduceFlame";
import ProtectionFromGoodAndEvil from "./ProtectionFromGoodAndEvil";
import RayOfFrost from "./RayOfFrost";
import RayOfSickness from "./RayOfSickness";
import Resistance from "./Resistance";
import SacredFlame from "./SacredFlame";
import Sanctuary from "./Sanctuary";
import ShieldOfFaith from "./ShieldOfFaith";
import Shillelagh from "./Shillelagh";
import ShockingGrasp from "./ShockingGrasp";
import Spell from "./Spell";
import TashasHideosLaughter from "./TashasHideousLaughter";
import ThornWhip from "./ThornWhip";
import Thunderwave from "./Thunderwave";
import TrueStrike from "./TrueStrike";
import WitchBolt from "./WitchBolt";

export type R<T> = {
  spell: new () => T;
  name: string;
  time: TimeType,
  level: number,
}

export const wizardSpells: R<Spell>[][] = [
  [
    { spell: AcidSplash, name: 'Acid Splash', time: 'Action', level: 0 },
    { spell: BladeWard, name: 'Blade Ward', time: 'Action', level: 0 },
    { spell: ChillTouch, name: 'Chill Touch', time: 'Action', level: 0 },
    { spell: FireBolt, name: 'Fire Bolt', time: 'Action', level: 0 },
    { spell: Light, name: 'Light', time: 'Action', level: 0 },
    { spell: PoisonSpray, name: 'Poison Spray', time: 'Action', level: 0 },
    { spell: RayOfFrost, name: 'Ray of Frost', time: 'Action', level: 0 },
    { spell: ShockingGrasp, name: 'Shocking Grasp', time: 'Action', level: 0 },
    { spell: TrueStrike, name: 'True Strike', time: 'Action', level: 0 },
  ],
  [
    { spell: BurningHands, name: 'Burning Hands', time: 'Action', level: 1 },
    { spell: ChromaticOrb, name: 'Chromatic Orb', time: 'Action', level: 1 },
    { spell: ColorSpray, name: 'Color Spray', time: 'Action', level: 1 },
    { spell: ExpeditiousRetreat, name: 'Expedititous Retreat', time: 'Bonus', level: 1 },
    { spell: FalseLife, name: 'False Life', time: 'Action', level: 1 },
    { spell: FogCloud, name: 'Fog Cloud', time: 'Action', level: 1 },
    { spell: Grease, name: 'Grease', time: 'Action', level: 1 },
    { spell: Jump, name: 'Jump', time: 'Action', level: 1 },
    { spell: Longstrider, name: 'Longstrider', time: 'Action', level: 1 },
    { spell: MageArmor, name: 'Mage Armor', time: 'Action', level: 1 },
    { spell: MagicMissile, name: 'Magic Missile', time: 'Action', level: 1 },
    { spell: ProtectionFromGoodAndEvil, name: 'Protection from Good and Evil', time: 'Action', level: 1 },
    { spell: RayOfSickness, name: 'Ray of Sickness', time: 'Action', level: 1 },
    { spell: TashasHideosLaughter, name: 'Tasha\'s Hideous Laughter', time: 'Action', level: 1 },
    { spell: Thunderwave, name: 'Thunderwave', time: 'Action', level: 1 },
    { spell: WitchBolt, name: 'Witch Bolt', time: 'Action', level: 1 },
  ],
]

export const clericSpells: R<Spell>[][] = [
  [
    { spell: Guidance, name: 'Guidance', time: 'Action', level: 0 },
    { spell: Light, name: 'LIght', time: 'Action', level: 0 },
    { spell: Resistance, name: 'Resistance', time: 'Action', level: 0 },
    { spell: SacredFlame, name: 'Sacred Flame', time: 'Action', level: 0 },
  ],
  [
    { spell: Bane, name: 'Bane', time: 'Action', level: 1 },
    { spell: Bless, name: 'Bless', time: 'Action', level: 1 },
    { spell: CureWounds, name: 'Cure Wounds', time: 'Action', level: 1 },
    { spell: GuidingBolt, name: 'Guiding Bolt', time: 'Action', level: 1 },
    { spell: HealingWord, name: 'Healing Word', time: 'Bonus', level: 1 },
    { spell: InflictWounds, name: 'Inflict Wounds', time: 'Action', level: 1 },
    { spell: ProtectionFromGoodAndEvil, name: 'Protection from Good and Evil', time: 'Action', level: 1 },
    { spell: Sanctuary, name: 'Sanctuary', time: 'Bonus', level: 1 },
    { spell: ShieldOfFaith, name: 'Shield of Faith', time: 'Bonus', level: 1 },
  ],
]

export const druidSpells: R<Spell>[][] = [
  [
    { spell: Guidance, name: 'Guidance', time: 'Action', level: 0 },
    { spell: PoisonSpray, name: 'Poison Spay', time: 'Action', level: 0 },
    { spell: ProduceFlame, name: 'Produce Flame', time: 'Action', level: 0 },
    { spell: Resistance, name: 'Resistance', time: 'Action', level: 0 },
    { spell: Shillelagh, name: 'Shillelagh', time: 'Bonus', level: 0 },
    { spell: ThornWhip, name: 'Thorn Whip', time: 'Action', level: 0 },
  ],
  [
    { spell: CharmPerson, name: 'Charm Person', time: 'Action', level: 1 },
    { spell: CureWounds, name: 'Cure Wounds', time: 'Action', level: 1 },
    { spell: Entangle, name: 'Entangle', time: 'Action', level: 1 },
    { spell: FaerieFire, name: 'Faerie Fire', time: 'Action', level: 1 },
    { spell: FogCloud, name: 'Fog Cloud', time: 'Action', level: 1 },
    { spell: Goodberry, name: 'Goodberry', time: 'Action', level: 1 },
    { spell: HealingWord, name: 'Healing Word', time: 'Bonus', level: 1 },
    { spell: Jump, name: 'Jump', time: 'Action', level: 1 },
    { spell: Longstrider, name: 'Longstrider', time: 'Action', level: 1 },
    { spell: Thunderwave, name: 'Thunderwave', time: 'Action', level: 1 },
  ],
]

export const getSpell = (spells: R<Spell>[][], name: string): R<Spell> | null => {
  for (const level of spells) {
    const spell = level.find((s) => s.name === name);

    if (spell) {
      return spell;
    }
  }

  return null;
}
