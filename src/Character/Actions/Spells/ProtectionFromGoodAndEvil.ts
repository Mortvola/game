import Spell from "./Spell";

class ProtectionFromGoodAndEvil extends Spell {
  constructor() {
    super('Protection from Evil and Good', 'Action', 1, 0, 10 * 60, true);
  }
}

export default ProtectionFromGoodAndEvil;
