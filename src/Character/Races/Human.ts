import { feetToMeters } from "../../Math";
import { AbilityScores } from "./AbilityScores";
import { Race, Size } from "./Race";

class Human implements Race {
  speed = feetToMeters(30);

  size = Size.Medium;

  abilityIncrease: AbilityScores = {
    charisma: 1,
    constitution: 1,
    dexterity: 1,
    intelligence: 1,
    strength: 1,
    wisdom: 1,
  };
}

export default Human;
