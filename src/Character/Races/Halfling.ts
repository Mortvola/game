import { feetToMeters } from "../../Math";
import { Race, Size } from "./Race";

class Halfling implements Race {
  speed = feetToMeters(25)

  size = Size.Small;

  abilityIncrease = {
    charisma: 0,
    constitution: 0,
    dexterity: 2,
    intelligence: 0,
    strength: 0,
    wisdom: 0,
  };
}

export default Halfling;
