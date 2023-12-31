import { abilityModifier } from "../../../Dice";

class Condition {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  armorClass(dexterity: number) {
    return 13 + abilityModifier(dexterity);
  }
}

export default Condition;
