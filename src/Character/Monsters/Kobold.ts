import CharacterClass from "../Classes/CharacterClass";
import Creature from "../Creature";
import { Armor } from "../Equipment/Armor";
import { getWeapon } from "../Equipment/Weapon";
import KoboldRace from "./KoboldRace";

class Kobold extends Creature {
  constructor(name: string) {
    const weapons = [
      getWeapon('Dagger'),
      getWeapon('Sling'),
    ]

    const armor: Armor[] = []

    const race = new KoboldRace();
    const charClass = new CharacterClass('Kobold', 1, 6, [], [], ['Daggers', 'Slings'])

    super(
      {
        strength: 7,
        dexterity: 15,
        constitution: 9,
        intelligence: 8,
        wisdom: 7,
        charisma: 8,
      },
      5,
      race,
      charClass,
      weapons,
      armor,
      25,
    );

    this.name = name;

    this.equipped.meleeWeapon = weapons[0];
    this.equipped.rangeWeapon = weapons[1];
    this.equipped.armor = armor[0];
    this.equipped.shield = armor[1];
  }
}

export default Kobold;
