import { feetToMeters } from "../../Math";
import { RaceInterface, Size } from "../../types";

class GoblinRace implements RaceInterface {
  name = "Goblin";

  speed = feetToMeters(30);

  size = Size.Small;

  height = feetToMeters(3);

  abilityIncrease = {
    charisma: 0,
    constitution: 0,
    dexterity: 0,
    intelligence: 0,
    strength: 0,
    wisdom: 0,
  };

  hitPointBonus = 0;

  clone(): GoblinRace {
    return new GoblinRace();
  }

  generateName(): string {
    return '';
  }
}

export default GoblinRace;
