export type ConditionType = 
  'Bane'
  | 'Blade Ward'
  | 'Bless'
  | 'Chill Touch'
  | 'Charmed'
  | 'Expedititous Retreat'
  | 'Guidance'
  | 'Jump'
  | 'Longstrider'
  | 'Mage Armor'
  | 'Poisoned'
  | 'Rage'
  | 'Resistance'
  | 'Sanctuary'
  | 'Shield of Faith'
  | 'Shillelagh'
  | 'TashasHideosLaughter'
  | 'True Strike'
  ;

class Condition {
  name: ConditionType;

  duration: number;

  constructor(name: ConditionType, duration: number) {
    this.name = name;
    this.duration = duration;
  }
}

export default Condition;
