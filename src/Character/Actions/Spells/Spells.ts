import Grease from "./Grease";
import MageArmor from "./MageArmor";
import MagicMissile from './MagicMissile'
import Spell from "./Spell";

export const spellList = [
  [
    new Spell('Acid Splash'),
    new Spell('Blade Ward'),
    new Spell('Chill Touch'),
    new Spell('Dancing Lights'),
    new Spell('Fire Bolt'),
    new Spell('Friends'),
    new Spell('Light'),
    new Spell('Mage Hand'),
    new Spell('Mending'),
    new Spell('Message'),
    new Spell('Minor Illusion'),
    new Spell('Poison Spray'),
    new Spell('Prestidigitation'),
    new Spell('Ray of Frost'),
    new Spell('Shocking Grasp'),
  ],
  [
    // 'Alarm',
    new Spell('Burning Hands'),
    new Spell('Charm Person'),
    new Spell('Chromatic Orb'),
    new Spell('Color Spray'),
    // 'Comprehend Languages',
    // 'Detect Magic',
    // 'Disguise Self',
    new Spell('Expeditious Retreat'),
    new Spell('False Life'),
    new Spell('Feather Fall'),
    new Spell('Find Familiar'),
    new Spell('Fog Cloud'),
    new Grease(),
    // 'Identify',
    // 'Illusory Script',
    new Spell('Jump'),
    new Spell('Longstrider'),
    new MageArmor(),
    new MagicMissile(),
    new Spell('Protection from Good and Evil'),
    new Spell('Ray of Sickness'),
    new Spell('Shield'),
    // 'Silent Image',
    new Spell('Sleep'),
    new Spell('Tasha\'s Hideous Laughter'),
    // 'Tenser\'s Floating Disk',
    new Spell('Thunderwave'),
    // 'Unseen Servant',
    new Spell('Witch Bolt'),
  ]
]

export const getSpell = (name: string): Spell | null => {
  for (const level of spellList) {
    const spell = level.find((s) => s.name === name);

    if (spell) {
      return spell;
    }
  }

  return null;
}