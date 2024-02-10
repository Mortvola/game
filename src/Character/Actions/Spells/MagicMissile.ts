import { feetToMeters } from "../../../Renderer/Math";
import Script from "../../../Script/Script";
import { diceRoll } from "../../../Dice";
import RangeSpell from "./RangeSpell";
import { Vec2, Vec4, vec2 } from "wgpu-matrix";
import { findPath2 } from "../../../Workers/PathPlannerQueue";
import { PathPoint } from "../../../Workers/PathPlannerTypes";
import Line from "../../../Renderer/Drawables/Line";
import { sceneObjectlManager } from "../../../SceneObjectManager";
import FollowPath from "../../../Script/FollowPath";
import DrawableNode from "../../../Renderer/Drawables/SceneNodes/DrawableNode";
import Parallel from "../../../Script/Parallel";
import { CreatureActorInterface } from "../../../types";
import { lineMaterial } from "../../../Renderer/Materials/Line";

class MagicMissile extends RangeSpell {
  paths: PathPoint[][] = [];

  missileLines: DrawableNode[] = [];

  lines: number[][] = [];

  constructor(actor: CreatureActorInterface) {
    super(actor, 3, false, 'Magic Missile', 'Action', 1, feetToMeters(120), 0, false, false)
  }

  clear() {
    super.clear();
    this.showPathLines(null);

    while (this.missileLines.length > 0) {
      this.removeMissileLines();
    }
  }

  async cast(script: Script): Promise<boolean> {
    const parallel = new Parallel(this.world);

    for (let i = 0; i < this.paths.length; i += 1) {
      const subScript = new Script(this.world);

      const shot = await sceneObjectlManager.getSceneObject('magic-missile', this.world);

      shot.sceneNode.translate[0] = this.paths[i][this.paths[i].length - 1].point[0];
      shot.sceneNode.translate[1] = 1;
      shot.sceneNode.translate[2] = this.paths[i][this.paths[i].length - 1].point[1];
  
      this.world.renderer.scene.addNode(shot.sceneNode);
  
      const followPath = new FollowPath(shot, this.paths[i], this.world, false, 24);
      followPath.onFinish = () => {
        this.world.renderer.scene.removeNode(shot.sceneNode);
      };

      subScript.entries.push(followPath) 

      this.targets[i].takeDamage(diceRoll(1, 4) + 1, false, this.actor, 'Magic Missle', subScript)
       
      parallel.entries.push(subScript)  
    }

    script.entries.push(parallel)  

    return true;
  }

  async prepareInteraction(target: CreatureActorInterface | null, point: Vec4 | null): Promise<void> {
    let description = `Select ${this.maxTargets  - this.targets.length} more targets.`;

    if (this.maxTargets === 1) {
      description = `Select 1 target.`;
    }

    if (target && (!this.uniqueTargets || !this.targets.includes(target))) {
      if (this.withinRange(target)) {
        this.focused = target;
      }
      else {
        this.focused = null;
        description = 'Target is out of range.'
      }
    }
    else {
      this.focused = null;
    }

    if (this.world.actionInfoCallback) {
      this.world.actionInfoCallback({
        action: this.name,
        description,
        percentSuccess: this.focused ? 100 : 0,
      })
    }   
    
    if (target) {
      const wp = this.actor.getWorldPosition();

      // If there isn't a point but there is a target
      // then use the target's location.
      let targetWp: Vec2;

      const tmp = target.getWorldPosition();
      targetWp = vec2.create(tmp[0], tmp[2])

      const [path, distance, lines, cancelled] = await findPath2(
        vec2.create(wp[0], wp[2]),
        targetWp,
        target.occupiedRadius,
        target,
        9999,
        true,
      )

      if (!cancelled) { // && !this.target) {
        for (const l of lines) {
          l[1] = 1;
        }

        await this.showPathLines(lines);

        this.path = path;
        this.distance = distance;

        this.lines = lines;
      }
    }
    else {
      await this.showPathLines(null);
    }
  }

  async interact(script: Script): Promise<boolean> {
    if (this.focused) {
      this.targets.push(this.focused);
      this.paths.push(this.path)
      this.focused = null;
      this.path = [];

      await this.addMissileLines(this.lines);
      this.lines = [];

      if (this.targets.length < this.maxTargets) {
        if (this.world.actionInfoCallback) {
          this.world.actionInfoCallback({
            action: this.name,
            description: `Select ${this.maxTargets - this.targets.length} more targets.`,
            percentSuccess: 100,
          })          
        }
      }
      else {
        return this.castSpell(script);
      }
    }

    return false;
  }

  async addMissileLines(lines: number[][]) {
    if (!this.cleared && lines.length > 0) {
      this.missileLines.push(await DrawableNode.create(new Line(lines), { shaderDescriptor: lineMaterial }));
      this.world.renderer.scene.addNode(this.missileLines[this.missileLines.length - 1]);
    }
  }

  removeMissileLines() {
    if (this.missileLines.length > 0) {
      this.world.renderer.scene.removeNode(this.missileLines[this.missileLines.length - 1]);
      this.missileLines.pop();
    }
  }
}

export default MagicMissile;
