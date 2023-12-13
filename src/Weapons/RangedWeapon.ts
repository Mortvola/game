import Weapon from "./Weapon";

class RangedWeapon extends Weapon {
  range: number;

  longRange: number;

  constructor(range: number, longRange: number) {
    super();
    
    this.range = range;
    this.longRange = longRange;
  }
}

export default RangedWeapon;
