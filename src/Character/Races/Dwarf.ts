import { feetToMeters } from "../../Renderer/Math";
import { RaceInterface, Size } from "../../types";

class Dwarf implements RaceInterface {
  name = "Dwarf";

  speed = feetToMeters(25);

  size = Size.Medium;

  height = feetToMeters(4.5);

  abilityIncrease = {
    charisma: 0,
    constitution: 2,
    dexterity: 0,
    intelligence: 0,
    strength: 0,
    wisdom: 0,
  };

  hitPointBonus = 0;

  clone(): Dwarf {
    return new Dwarf();
  }

  generateName(): string {
    const index = Math.trunc(Math.random() * Dwarf.names[0].length);

    return Dwarf.names[0][index]
  }

  static names = [
    [
      "Adrik","Alberich", "Baern", "Barend", "Brottor", "Bruenor", "Dain", "Darrak",
      "Delg", "Eberk", "Einkil", "Fargrim", "Flint", "Gardain", "Harbek", "Kildrak",
      "Morgran", "Orsik", "Oskar", "Rangrim", "Rurik", "Taklinn", "Thoradin", "Thorin",
      "Tordek", "Traubon", "Travok", "Ulfgar", "Veit", "Vondal",
    ],
    [
      "Amber", "Artin", "Audhild", "Bardryn", "Dagnal", "Diesa", "Eldeth", "Falkrunn",
      "Finellen", "Gunnloda", "Gurdis", "Helja", "Hlin", "Kathra", "Kristryd", "Ilde",
      "Liftrasa", "Mardred", "Riswynn", "Sannl", "Torbera", "Torgga, Vistra",
    ]
  ]
}

export default Dwarf;
