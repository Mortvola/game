import Halfling from "./Halfling";

class LightfootHalfling extends Halfling {
  name = 'Lightfoot Halfling';

  abilityIncrease = {
    charisma: 1,
    constitution: 0,
    dexterity: 2,
    intelligence: 0,
    strength: 0,
    wisdom: 0,
  };

  hitPointBonus = 0;

  clone(): LightfootHalfling {
    return new LightfootHalfling();
  }
}

export default LightfootHalfling;
