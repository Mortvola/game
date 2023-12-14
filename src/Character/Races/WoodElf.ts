import { feetToMeters } from "../../Math";
import Elf from "./Elf";

class WoodElf extends Elf {
  name = 'Wood Elf';

  speed = feetToMeters(35); 

  abilityIncrease = {
    charisma: 0,
    constitution: 0,
    dexterity: 2,
    intelligence: 0,
    strength: 0,
    wisdom: 1,
  };

  clone(): WoodElf {
    return new WoodElf();
  }
}

export default WoodElf;
