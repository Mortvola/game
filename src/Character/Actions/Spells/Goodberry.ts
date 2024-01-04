import Script from "../../../Script/Script";
import { WorldInterface } from "../../../WorldInterface";
import Actor from "../../Actor";
import TouchSpell from "./TouchSpell";

class Goodberry extends TouchSpell {
  constructor() {
    super('Goodberry', 'Action', 1, 0, 0, false);
  }

  cast(actor: Actor, script: Script, world: WorldInterface) {
    
  }
}

export default Goodberry;
