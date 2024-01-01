import AcidSplash from "./AcidSplash";
import Bane from "./Bane";
import BladeWard from "./BladeWard";
import Bless from "./Bless";
import BurningHands from "./BurningHands";
import ChillTouch from "./ChillTouch";
import CureWounds from "./CureWounds";
import FireBolt from "./FireBolt";
import Grease from "./Grease";
import Guidance from "./Guidance";
import GuidingBolt from "./GuidingBolt";
import HealingWord from "./HealingWord";
import InflictWounds from "./InflictWounds";
import Light from "./LIght";
import MageArmor from "./MageArmor";
import MagicMissile from './MagicMissile'
import PoisonSpray from "./PoisonSpray";
import ProtectionFromGoodAndEvil from "./ProtectionFromGoodAndEvil";
import RayOfFrost from "./RayOfFrost";
import Resistance from "./Resistance";
import SacredFlame from "./SacredFlame";
import Sanctuary from "./Sanctuary";
import ShieldOfFaith from "./ShieldOfFaith";
import ShockingGrasp from "./ShockingGrasp";
import Spell from "./Spell";
import Thunderwave from "./Thunderwave";
import TrueStrike from "./TrueStrike";
import WitchBolt from "./WitchBolt";

export class R<T> {
  spell: new () => T;
  name: string;

  constructor(spell: new () => T, name: string) {
    this.spell = spell;
    this.name = name;
  }
}

export const wizardSpells: R<Spell>[][] = [
  [
    new R(AcidSplash, 'Acid Splash'),
    new R(BladeWard, 'Blade Ward'),
    new R(ChillTouch, 'Chill Touch'),
    new R(FireBolt, 'Fire Bolt'),
    new R(Light, 'Light'),
    new R(PoisonSpray, 'Poison Spray'),
    new R(RayOfFrost, 'Ray of Frost'),
    new R(ShockingGrasp, 'Shocking Grasp'),
    new R(TrueStrike, 'True Strike')
  ],
  [
    new R(BurningHands, 'Burning Hands'),
    new R(Grease, 'Grease'),
    new R(MageArmor, 'Mage Armor'),
    new R(MagicMissile, 'Magic Missle'),
    new R(Thunderwave, 'Thunderwave'),
    new R(WitchBolt, 'Witch Bolt'),
  ],
]

export const clericSpells: R<Spell>[][] = [
  [
    new R(Guidance, 'Guidance'),
    new R(Light, 'LIght'),
    new R(Resistance, 'Resistance'),
    new R(SacredFlame, 'Sacred Flame'),
  ],
  [
    new R(Bane, 'Bane'),
    new R(Bless, 'Bless'),
    new R(CureWounds, 'Cure Wounds'),
    new R(GuidingBolt, 'Guiding Bolt'),
    new R(HealingWord, 'Healing Word'),
    new R(InflictWounds, 'Inflict Wounds'),
    new R(ProtectionFromGoodAndEvil, 'Protection from Good and Evil'),
    new R(Sanctuary, 'Sanctuary'),
    new R(ShieldOfFaith, 'Shield of Faith'),
  ]
]

// export const spellList = [
//   [
//     new Spell('Acid Splash'),
//     new Spell('Blade Ward'),
//     new Spell('Chill Touch'),
//     new Spell('Dancing Lights'),
//     new Spell('Fire Bolt'),
//     new Spell('Friends'),
//     new Spell('Light'),
//     new Spell('Mage Hand'),
//     new Spell('Mending'),
//     new Spell('Message'),
//     new Spell('Minor Illusion'),
//     new Spell('Poison Spray'),
//     new Spell('Prestidigitation'),
//     new Spell('Ray of Frost'),
//     new Spell('Shocking Grasp'),
//   ],
//   [
//     // 'Alarm',
//     new Spell('Burning Hands'),
//     new Spell('Charm Person'),
//     new Spell('Chromatic Orb'),
//     new Spell('Color Spray'),
//     // 'Comprehend Languages',
//     // 'Detect Magic',
//     // 'Disguise Self',
//     new Spell('Expeditious Retreat'),
//     new Spell('False Life'),
//     new Spell('Feather Fall'),
//     new Spell('Find Familiar'),
//     new Spell('Fog Cloud'),
//     new Grease(),
//     // 'Identify',
//     // 'Illusory Script',
//     new Spell('Jump'),
//     new Spell('Longstrider'),
//     new MageArmor(),
//     new MagicMissile(),
//     new Spell('Protection from Good and Evil'),
//     new Spell('Ray of Sickness'),
//     new Spell('Shield'),
//     // 'Silent Image',
//     new Spell('Sleep'),
//     new Spell('Tasha\'s Hideous Laughter'),
//     // 'Tenser\'s Floating Disk',
//     new Spell('Thunderwave'),
//     // 'Unseen Servant',
//     new Spell('Witch Bolt'),
//   ]
// ]

export const getSpell = (spells: R<Spell>[][], name: string): R<Spell> | null => {
  for (const level of spells) {
    const spell = level.find((s) => s.name === name);

    if (spell) {
      return spell;
    }
  }

  return null;
}
