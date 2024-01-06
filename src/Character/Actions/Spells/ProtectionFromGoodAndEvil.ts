import Actor from "../../Actor";
import Spell from "./Spell";

class ProtectionFromGoodAndEvil extends Spell {
  constructor(actor: Actor) {
    super(actor, 1, true, 'Protection from Evil and Good', 'Action', 1, 10 * 60, false, true);
  }
}

export default ProtectionFromGoodAndEvil;
