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

type TimeType = 'Action' | 'Bonus' | 'Move';

export type R<T> = {
  spell: new () => T;
  name: string;
  time: TimeType,
}

export const wizardSpells: R<Spell>[][] = [
  [
    { spell: AcidSplash, name: 'Acid Splash', time: 'Action' },
    { spell: BladeWard, name: 'Blade Ward', time: 'Action' },
    { spell: ChillTouch, name: 'Chill Touch', time: 'Action' },
    { spell: FireBolt, name: 'Fire Bolt', time: 'Action' },
    { spell: Light, name: 'Light', time: 'Action' },
    { spell: PoisonSpray, name: 'Poison Spray', time: 'Action' },
    { spell: RayOfFrost, name: 'Ray of Frost', time: 'Action' },
    { spell: ShockingGrasp, name: 'Shocking Grasp', time: 'Action' },
    { spell: TrueStrike, name: 'True Strike', time: 'Action' },
  ],
  [
    { spell: BurningHands, name: 'Burning Hands', time: 'Action' },
    { spell: Grease, name: 'Grease', time: 'Action' },
    { spell: MageArmor, name: 'Mage Armor', time: 'Action' },
    { spell: MagicMissile, name: 'Magic Missle', time: 'Action' },
    { spell: Thunderwave, name: 'Thunderwave', time: 'Action' },
    { spell: WitchBolt, name: 'Witch Bolt', time: 'Action' },
  ],
]

export const clericSpells: R<Spell>[][] = [
  [
    { spell: Guidance, name: 'Guidance', time: 'Action' },
    { spell: Light, name: 'LIght', time: 'Action' },
    { spell: Resistance, name: 'Resistance', time: 'Action' },
    { spell: SacredFlame, name: 'Sacred Flame', time: 'Action' },
  ],
  [
    { spell: Bane, name: 'Bane', time: 'Action' },
    { spell: Bless, name: 'Bless', time: 'Action' },
    { spell: CureWounds, name: 'Cure Wounds', time: 'Action' },
    { spell: GuidingBolt, name: 'Guiding Bolt', time: 'Action' },
    { spell: HealingWord, name: 'Healing Word', time: 'Bonus' },
    { spell: InflictWounds, name: 'Inflict Wounds', time: 'Action' },
    { spell: ProtectionFromGoodAndEvil, name: 'Protection from Good and Evil', time: 'Action' },
    { spell: Sanctuary, name: 'Sanctuary', time: 'Bonus' },
    { spell: ShieldOfFaith, name: 'Shield of Faith', time: 'Bonus' },
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
