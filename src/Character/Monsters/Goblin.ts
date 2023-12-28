import CharacterClass from "../Classes/CharacterClass";
import Creature from "../Creature";
import { getArmor } from "../Equipment/Armor";
import { getWeapon } from "../Equipment/Weapon";
import GoblinRace from "./GoblinRace";

class Goblin extends Creature {
  constructor(name: string) {
    const weapons = [
      getWeapon('Scimitar'),
      getWeapon('Shortbow'),
    ]

    const armor = [
      getArmor('Leather'),
      getArmor('Shield')
    ]

    const race = new GoblinRace();
    const charClass = new CharacterClass('Goblin', 1, 6, [], [], ['Scimitars'])

    super(
      {
        strength: 8,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 8,
        charisma: 8,
      },
      7,
      race,
      charClass,
      weapons,
      armor,
    );

    this.name = name;

    this.equipped.meleeWeapon = weapons[0];
    this.equipped.rangeWeapon = weapons[1];
    this.equipped.armor = armor[0];
    this.equipped.shield = armor[1];
  }
}

export default Goblin;
