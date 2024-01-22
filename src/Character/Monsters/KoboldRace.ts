import { feetToMeters } from "../../Renderer/Math";
import { RaceInterface, Size } from "../../types";

class KoboldRace implements RaceInterface {
  name = "Kobold";

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

  clone(): KoboldRace {
    return new KoboldRace();
  }

  generateName(): string {
    return '';
  }
}

export default KoboldRace;
