import { abilityModifier } from "../Dice";

class Weapon {
  cost = 0;

  damage(abilityScore: number): number {
    const roll = this.damageRoll();

    const modififier = abilityModifier(abilityScore);

    // console.log(`roll: ${roll}, modifier: ${modififier}, abilityScore: ${abilityScore}`)
    return roll + modififier;
  }

  damageRoll(): number {
    return 0;
  }
}

export default Weapon;
