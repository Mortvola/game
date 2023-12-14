import { feetToMeters } from "../../Math";
import { AbilityScores } from "./AbilityScores";
import { Race, Size } from "./Race";

class Human implements Race {
  name = 'Human';

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

  clone(): Human {
    return new Human();
  }

  generateName(): string {
    const index = Math.trunc(Math.random() * Human.names[0].length);

    return Human.names[0][index]
  }

  static names = [
    [
      "Aseir", "Bardeid", "Haseid", "Khemed", "Mehmen", "Sudeiman, Zasheir",
      "Darvin", "Dorn", "Evendur", "Gorstag", "Grim", "Helm", "Malark", "Morn", "Randal", "Stedd",
      "Bor", "Fodel", "Glar", "Grigor", "Igan", "Ivor", "Kosef", "Mival", "Orel", "Pavel", "Sergor",
      "Ander", "Blath", "Bran", "Frath", "Geth", "Lander", "Luth", "Malcer", "Stor", "Taman", "Urth",
      "Aoth", "Bareris", "Ehput-Ki", "Kethoth", "Mumed", "Ramas", "So-Kehur", "Thazar-De", "Urhur",
      "Borivik", "Faurgar", "Jandar", "Kanithar", "Madislak", "Ralmevik", "Shaumar", "Vladislak",
      "An", "Chen", "Chi", "Fai", "Jiang", "Jun", "Lian", "Long", "Meng", "On", "Shan", "Shui", "Wen",
      "Anton", "Diero", "Marcon", "Pieron", "Rimardo", "Romero", "Salazar", "Umbero",
    ],
    [
      "Atala", "Ceidil", "Hama", "Jasmal", "Meilil", "Seipora", "Yasheira", "Zasheida",
      "Arveene", "Esvele", "Jhessail", "Kerri", "Lureene", "Miri", "Rowan", "Shandri", "Tessele",
      "Alethra", "Kara", "Katernin", "Mara", "Natali", "Olma", "Tana", "Zora",
      "Amafrey", "Betha", "Cefrey", "Kethra", "Mara", "Olga", "Silifrey", "Westra",
      "Arizima", "Chathi", "Nephis", "Nulara", "Murithi", "Sefris", "Thola", "Umara", "Zolis",
      "Fyevarra", "Hulmarra", "Immith", "Imzel", "Navarra", "Shevarra", "Tammith", "Yuldra",
      "Bai", "Chao", "Jia", "Lei", "Mei", "Qiao", "Shui", "Tai",
      "Balama", "Dona", "Faila", "Jalana", "Luisa", "Marta", "Quara", "Selise", "Vonda",
    ]
  ]
}

export default Human;
