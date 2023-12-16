import Barbarian from "./Classes/Barbarian";
import Bard from "./Classes/Bard";
import CharacterClass from "./Classes/CharacterClass";
import Cleric from "./Classes/Cleric";
import Druid from "./Classes/Druid";
import Fighter from "./Classes/Fighter";
import Monk from "./Classes/Monk";
import Paladin from "./Classes/Paladin";
import Ranger from "./Classes/Ranger";
import Rogue from "./Classes/Rogue";
import Sorcerer from "./Classes/Sorcerer";
import Warlock from "./Classes/Warlock";
import Wizard from "./Classes/Wizard";
import Dwarf from "./Races/Dwarf";
import Elf from "./Races/Elf";
import Halfling from "./Races/Halfling";
import HighElf from "./Races/HighElf";
import HillDwarf from "./Races/HillDwarf";
import Human from "./Races/Human";
import LightfootHalfling from "./Races/LightfootHalfling";
import MountainDwarf from "./Races/MountainDwarf";
import { Race } from "./Races/Race";
import StoutHalfling from "./Races/StoutHalfling";
import WoodElf from "./Races/WoodElf";

export const getRace = (race: string) => {
  let r: Race | null = null;

  switch (race) {
    case "Dwarf":
      r = new Dwarf();
      break;
    case "Elf":
      r = new Elf();
      break;
    case "Halfling":
      r = new Halfling();
      break;
    case "High Elf":
      r = new HighElf();
      break;
    case "Hill Dwarf":
      r = new HillDwarf();
      break;
    case "Human":
      r = new Human();
      break;
    case "Lightfoot Halfling":
      r = new LightfootHalfling();
      break;
    case "Mountain Dwarf":
      r = new MountainDwarf();
      break;
    case "Stout Halfling":
      r = new StoutHalfling();
      break;
    case "Wood Elf":
      r = new WoodElf();
      break;
  }

  return r;
}

export const getClass = (charClass: string) => {
  let c: CharacterClass | null = null;

  switch (charClass) {
    case "Barbarian":
      c = new Barbarian();
      break;
    case "Bard":
      c = new Bard();
      break;
    case "Cleric":
      c = new Cleric();
      break;
    case "Druid":
      c = new Druid();
      break;
    case "Fighter":
      c = new Fighter();
      break;
    case "Monk":
      c = new Monk();
      break;
    case "Paladin":
      c = new Paladin();
      break;
    case "Ranger":
      c = new Ranger();
      break;
    case "Rogue":
      c = new Rogue();
      break;
    case "Sorcerer":
      c = new Sorcerer();
      break;
    case "Warlock":
      c = new Warlock();
      break;
    case "Wizard":
      c = new Wizard();
      break;
  }

  return c;
}