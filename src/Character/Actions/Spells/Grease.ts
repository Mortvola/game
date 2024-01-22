import { mat4, quat, vec2, vec3, vec4 } from "wgpu-matrix";
import { degToRad, feetToMeters, pointWithinCircle } from "../../../Math";
import Script from "../../../Script/Script";
import { addOccupant } from "../../../Workers/PathPlannerQueue";
import { Occupant } from "../../../Workers/PathPlannerTypes";
import { getActorId } from "../../Actor";
import AreaSpell from "./AreaSpell";
import { savingThrow } from "../../../Dice";
import Logger from "../../../Script/Logger";
import Circle from "../../../Renderer/Drawables/Circle";
import DrawableNode from "../../../Renderer/Drawables/SceneNodes/DrawableNode";
import { CreatureActorInterface, WorldInterface } from "../../../types";
import { circleMaterial } from "../../../Renderer/Materials/Circle";

class Grease extends AreaSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 'Grease', 'Action', 1, feetToMeters(10), feetToMeters(60), 60, false, false)
  }

  async cast(script: Script, world: WorldInterface): Promise<boolean> {
    if (this.center) {
      const obj = await DrawableNode.create(new Circle(this.radius, this.radius, vec4.create(0.2, 0.2, 0.2, 1)), circleMaterial)
      obj.translate = vec3.create(this.center[0], 0, this.center[1])
  
      world.scene.addNode(obj);
  
      const q = quat.fromEuler(degToRad(270), 0, 0, "xyz");
      obj.postTransforms.push(mat4.fromQuat(q));  

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
