import { abilityModifier } from "../../../Dice";
import Condition from "./Condition";

class MageArmor extends Condition {
  constructor() {
    super('Mage Armor', 8 * 60 * 60)
  }

  armorClass(dexterity: number) {
    return 13 + abilityModifier(dexterity);
  }
}

export default MageArmor;
