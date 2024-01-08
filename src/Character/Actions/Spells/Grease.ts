import { vec2 } from "wgpu-matrix";
import { feetToMeters, pointWithinCircle } from "../../../Math";
import Script from "../../../Script/Script";
import { addOccupant } from "../../../Workers/PathPlannerQueue";
import { Occupant } from "../../../Workers/PathPlannerTypes";
import { WorldInterface } from "../../../WorldInterface";
import Actor, { getActorId } from "../../Actor";
import AreaSpell from "./AreaSpell";
import { savingThrow } from "../../../Dice";
import Logger from "../../../Script/Logger";

class Grease extends AreaSpell {
  constructor(actor: Actor) {
    super(actor, 'Grease', 'Action', 1, feetToMeters(10), feetToMeters(60), 60, false, false)
  }

  cast(script: Script, world: WorldInterface): boolean {
    if (this.center) {
      const occupant: Occupant = {
        id: getActorId(),
        center: this.center,
        radius: this.radius,
        type: 'Terrain',
        name: 'Grease',
        dc: this.actor.character.spellCastingDc,
      };
  
      world.occupants.push(occupant)
      addOccupant(occupant)  

      for (const party of world.participants.participants) {
        for (const member of party) {
          const wp = member.getWorldPosition();
          const wpV2 = vec2.create(wp[0], wp[2]);

          if (pointWithinCircle(this.center, this.radius, wpV2)) {
            const st = savingThrow(member.character, member.character.abilityScores.dexterity, 'Neutral');

            if (st < this.actor.character.spellCastingDc) {
              script.entries.push(new Logger(`${member.character.name} fell prone`))
              member.character.addCondition('Prone')
            }
            else {
              script.entries.push(new Logger(`${member.character.name} succeeded at a dexterity saving throw.`))
            }
          }
        }
      }
    }

    return true;
  }
}

export default Grease;
