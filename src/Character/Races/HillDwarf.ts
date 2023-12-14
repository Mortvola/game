import Dwarf from "./Dwarf";

class HillDwarf extends Dwarf {
  name = "Hill Dwarf";

  abilityIncrease = {
    charisma: 0,
    constitution: 2,
    dexterity: 0,
    intelligence: 0,
    strength: 0,
    wisdom: 1,
  };

  clone(): HillDwarf {
    return new HillDwarf();
  }
}

export default HillDwarf;
