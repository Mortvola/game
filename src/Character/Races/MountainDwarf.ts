import Dwarf from "./Dwarf";

class MountainDwarf extends Dwarf {
  name = "Mountain Dwarf";

  abilityIncrease = {
    charisma: 0,
    constitution: 2,
    dexterity: 0,
    intelligence: 0,
    strength: 2,
    wisdom: 0,
  };

  clone(): MountainDwarf {
    return new MountainDwarf();
  }
}

export default MountainDwarf;
