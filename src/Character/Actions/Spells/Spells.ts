import { SpellFactory } from "../../../types";
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

export const wizardSpells: SpellFactory<Spell>[][] = [
  [
    new SpellFactory(AcidSplash, 'Acid Splash', 'Action', 0),
    new SpellFactory(BladeWard, 'Blade Ward', 'Action', 0),
    new SpellFactory(ChillTouch, 'Chill Touch', 'Action', 0),
    new SpellFactory(FireBolt, 'Fire Bolt', 'Action', 0),
    new SpellFactory(Light, 'Light', 'Action', 0),
    new SpellFactory(PoisonSpray, 'Poison Spray', 'Action', 0),
    new SpellFactory(RayOfFrost, 'Ray of Frost', 'Action', 0),
    new SpellFactory(ShockingGrasp, 'Shocking Grasp', 'Action', 0),
    new SpellFactory(TrueStrike, 'True Strike', 'Action', 0),
  ],
  [
    new SpellFactory(BurningHands, 'Burning Hands', 'Action', 1),
    new SpellFactory(ChromaticOrb, 'Chromatic Orb', 'Action', 1),
    new SpellFactory(ColorSpray, 'Color Spray', 'Action', 1),
    new SpellFactory(ExpeditiousRetreat, 'Expedititous Retreat', 'Bonus', 1),
    new SpellFactory(FalseLife, 'False Life', 'Action', 1),
    new SpellFactory(FogCloud, 'Fog Cloud', 'Action', 1),
    new SpellFactory(Grease, 'Grease', 'Action', 1),
    new SpellFactory(Jump, 'Jump', 'Action', 1),
    new SpellFactory(Longstrider, 'Longstrider', 'Action', 1),
    new SpellFactory(MageArmor, 'Mage Armor', 'Action', 1),
    new SpellFactory(MagicMissile, 'Magic Missile', 'Action', 1),
    new SpellFactory(ProtectionFromGoodAndEvil, 'Protection from Good and Evil', 'Action', 1),
    new SpellFactory(RayOfSickness, 'Ray of Sickness', 'Action', 1),
    new SpellFactory(TashasHideosLaughter, 'Tasha\'s Hideous Laughter', 'Action', 1),
    new SpellFactory(Thunderwave, 'Thunderwave', 'Action', 1),
    new SpellFactory(WitchBolt, 'Witch Bolt', 'Action', 1),
  ],
]

export const clericSpells: SpellFactory<Spell>[][] = [
  [
    new SpellFactory(Guidance, 'Guidance', 'Action', 0),
    new SpellFactory(Light, 'LIght', 'Action', 0),
    new SpellFactory(Resistance, 'Resistance', 'Action', 0),
    new SpellFactory(SacredFlame, 'Sacred Flame', 'Action', 0),
  ],
  [
    new SpellFactory(Bane, 'Bane', 'Action', 1),
    new SpellFactory(Bless, 'Bless', 'Action', 1),
    new SpellFactory(CureWounds, 'Cure Wounds', 'Action', 1),
    new SpellFactory(GuidingBolt, 'Guiding Bolt', 'Action', 1),
    new SpellFactory(HealingWord, 'Healing Word', 'Bonus', 1),
    new SpellFactory(InflictWounds, 'Inflict Wounds', 'Action', 1),
    new SpellFactory(ProtectionFromGoodAndEvil, 'Protection from Good and Evil', 'Action', 1),
    new SpellFactory(Sanctuary, 'Sanctuary', 'Bonus', 1),
    new SpellFactory(ShieldOfFaith, 'Shield of Faith', 'Bonus', 1),
  ],
]

export const druidSpells: SpellFactory<Spell>[][] = [
  [
    new SpellFactory(Guidance, 'Guidance', 'Action', 0),
    new SpellFactory(PoisonSpray, 'Poison Spay', 'Action', 0),
    new SpellFactory(ProduceFlame, 'Produce Flame', 'Action', 0),
    new SpellFactory(Resistance, 'Resistance', 'Action', 0),
    new SpellFactory(Shillelagh, 'Shillelagh', 'Bonus', 0),
    new SpellFactory(ThornWhip, 'Thorn Whip', 'Action', 0),
  ],
  [
    new SpellFactory(CharmPerson, 'Charm Person', 'Action', 1),
    new SpellFactory(CureWounds, 'Cure Wounds', 'Action', 1),
    new SpellFactory(Entangle, 'Entangle', 'Action', 1),
    new SpellFactory(FaerieFire, 'Faerie Fire', 'Action', 1),
    new SpellFactory(FogCloud, 'Fog Cloud', 'Action', 1),
    new SpellFactory(Goodberry, 'Goodberry', 'Action', 1),
    new SpellFactory(HealingWord, 'Healing Word', 'Bonus', 1),
    new SpellFactory(Jump, 'Jump', 'Action', 1),
    new SpellFactory(Longstrider, 'Longstrider', 'Action', 1),
    new SpellFactory(Thunderwave, 'Thunderwave', 'Action', 1),
  ],
]

export const getSpell = (spells: SpellFactory<Spell>[][], name: string): SpellFactory<Spell> | null => {
  for (const level of spells) {
    const spell = level.find((s) => s.name === name);

    if (spell) {
      return spell;
    }
  }

  return null;
}
