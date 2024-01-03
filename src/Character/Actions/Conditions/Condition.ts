export type ConditionType = 
  'Bane'
  | 'Bless'
  | 'Charmed'
  | 'Mage Armor'
  | 'Rage'
  | 'Sanctuary'
  | 'Shield of Faith'
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
