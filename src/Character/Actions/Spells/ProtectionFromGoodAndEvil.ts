import { CreatureActorInterface } from "../../../types";
import Spell from "./Spell";

class ProtectionFromGoodAndEvil extends Spell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Protection from Evil and Good', 'Action', 1, 10 * 60, false, true);
  }
}

export default ProtectionFromGoodAndEvil;
