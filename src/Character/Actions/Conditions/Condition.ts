export type ConditionType = 
  'Poisoned'
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
