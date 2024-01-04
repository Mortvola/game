import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import TouchSpell from "./TouchSpell";
import JumpCondition from '../Conditions/Jump'

class Jump extends TouchSpell {
  constructor() {
    super('Jump', 'Action', 1, 0, 60, false);
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    this.target!.character.conditions.push(new JumpCondition())
  }
}

export default Jump;
