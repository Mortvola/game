import Spell from "./Spell";

class MageArmor extends Spell {
  castingTime = 1;

  range = 0;

  duration = 8 * 60 * 60;

  constructor() {
    super('Mage Armor')
  }
}

export default MageArmor;
