import { feetToMeters } from "../../Math";
import { Race, Size } from "./Race";

class Dwarf implements Race {
  speed = feetToMeters(25);

  size = Size.Medium;

  abilityIncrease = {
    charisma: 0,
    constitution: 2,
    dexterity: 0,
    intelligence: 0,
    strength: 0,
    wisdom: 0,
  };
}

export default Dwarf;
