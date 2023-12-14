import Elf from "./Elf";

class HighElf extends Elf {
  name = "High Elf";

  abilityIncrease = {
    charisma: 0,
    constitution: 0,
    dexterity: 2,
    intelligence: 1,
    strength: 0,
    wisdom: 0,
  };

  clone(): HighElf {
    return new HighElf();
  }
}

export default HighElf;
