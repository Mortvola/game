import Actor from "../../Actor";
import Spell from "./Spell";

class ProtectionFromGoodAndEvil extends Spell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Protection from Evil and Good', 'Action', 1, 0, 10 * 60, true);
  }
}

export default ProtectionFromGoodAndEvil;
