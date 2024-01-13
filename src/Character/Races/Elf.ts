import { feetToMeters } from "../../Math";
import { RaceInterface, Size } from "../../types";

class Elf implements RaceInterface {
  name = "Elf";

  speed = feetToMeters(30);

  size = Size.Medium;

  height = feetToMeters(5.75);

  abilityIncrease = {
    charisma: 0,
    constitution: 0,
    dexterity: 2,
    intelligence: 0,
    strength: 0,
    wisdom: 0,
  };

  hitPointBonus = 0;

  clone(): Elf {
    return new Elf();
  }

  generateName(): string {
    const index = Math.trunc(Math.random() * Elf.names[0].length);

    return Elf.names[0][index]
  }

  static names = [
    [
      "Adran", "Aelar", "Aramil", "Arannis", "Aust", "Beiro", "Berrian", "Carric",
      "Enialis", "Erdan", "Erevan", "Galinndan", "Hadarai", "Heian", "Himo", "Immeral",
      "Ivellios", "Laucian", "Mindartis", "Paelias", "Peren", "Quarion", "Riardon", "Rolen",
      "Soveliss", "Thamior", "Tharivol", "Theren, Varis",
    ],
    [
      "Adrie", "Althaea", "Anastrianna", "Andraste", "Antinua", "Bethrynna", "Birel",
      "Caelynn", "Drusilia", "Enna", "Felosial", "Ielenia", "Jelenneth", "Keyleth",
      "Leshanna", "Lia", "Meriele", "Mialee", "Naivara", "Quelenna", "Quillathe", "Sariel",
      "Shanairra", "Shava", "Silaqui", "Theirastra", "Thia", "Vadania", "Valanthe, Xanaphia",
    ]
  ]
}

export default Elf;
