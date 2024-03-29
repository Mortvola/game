import { feetToMeters } from "../../../Renderer/Math";
import { CreatureActorInterface } from '../../../types'
import { diceRoll, spellAttackRoll } from "../../../Dice";
import Script from "../../../Script/Script";
import RangeSpell from "./RangeSpell";
import { DamageType } from "../../Equipment/Types";
import { sceneObjectlManager } from "../../../SceneObjectManager";
import { PathPoint } from "../../../Workers/PathPlannerTypes";
import { vec2 } from "wgpu-matrix";
import FollowPath from "../../../Script/FollowPath";

class GuidingBolt extends RangeSpell {
  constructor(actor: CreatureActorInterface) {
    super(actor, 1, true, 'Guiding Bolt', 'Action', 1, feetToMeters(120), 6, true, false)
  }

  async cast(script: Script): Promise<boolean> {
    const shot = await sceneObjectlManager.getSceneObject('Guiding Shot', this.world);

    const wp = this.actor.getWorldPosition();
    const targetWp = this.targets[0].getWorldPosition();

    const path: PathPoint[] = [
      { point: vec2.create(targetWp[0], targetWp[2]), difficult: false, type: 'Creature' },
      { point: vec2.create(wp[0], wp[2]), difficult: false, type: 'Creature' },
    ]

    shot.sceneNode.translate[0] = path[path.length - 1].point[0];
    shot.sceneNode.translate[1] = 1;
    shot.sceneNode.translate[2] = path[path.length - 1].point[1];

    this.world.renderer.scene.addSceneObject(shot);

    const followPath = new FollowPath(shot, path, this.world, false, 24);
    
    followPath.onFinish = () => {
      this.world.renderer.scene.removeSceneObject(shot);
    }

    script.entries.push(followPath)  

    const [damage, critical] = spellAttackRoll(
      this.actor.character,
      this.targets[0].character,
      () => diceRoll(4, 6),
      DamageType.Radiant,
      'Neutral'
    )

    this.targets[0].takeDamage(damage, critical, this.actor, this.name, script);

    if (damage > 0) {
      this.targets[0].character.addInfluencingAction(this);

      return true;
    }

    return false;
  }
}

export default GuidingBolt;
