import { feetToMeters } from "../../Math";
import { Race, Size } from "./Race";

class Halfling implements Race {
  name = "Halfling";

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

  clone(): Halfling {
    return new Halfling();
  }

  generateName(): string {
    const index = Math.trunc(Math.random() * Halfling.names[0].length);

    return Halfling.names[0][index]
  }
  
  static names = [
    [
      "Alton", "Ander", "Cade", "Corrin", "Eldon", "Errich", "Finnan",
      "Garret", "Lindal", "Lyle", "Merric", "Milo", "Osborn", "Perrin",
      "Reed", "Roscoe", "Wellby",
    ],
    [
      "Andry", "Bree", "Callie", "Cora", "Euphemia", "Jillian", "Kithri",
      "Lavinia", "Lidda", "Merla", "Nedda", "Paela", "Portia", "Seraphina",
      "Shaena", "Trym", "Vani", "Verna",
    ]
  ]
}

export default Halfling;
