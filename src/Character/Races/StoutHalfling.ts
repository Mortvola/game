import Halfling from "./Halfling";

class StoutHalfling extends Halfling {
  name = 'Stout Halfling';

  abilityIncrease = {
    charisma: 0,
    constitution: 1,
    dexterity: 2,
    intelligence: 0,
    strength: 0,
    wisdom: 0,
  };

  clone(): StoutHalfling {
    return new StoutHalfling();
  }
}

export default StoutHalfling;
