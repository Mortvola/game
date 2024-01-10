import { feetToMeters } from "../../../Math";
import Script from "../../../Script/Script";
import Actor from "../../Actor";
import { WorldInterface } from "../../../WorldInterface";
import { diceRoll } from "../../../Dice";
import RangeSpell from "./RangeSpell";
import { Vec2, Vec4, vec2 } from "wgpu-matrix";
import { findPath2 } from "../../../Workers/PathPlannerQueue";
import { PathPoint } from "../../../Workers/PathPlannerTypes";
import Line from "../../../Drawables/Line";
import { getWorld } from "../../../Renderer";
import FollowPath from "../../../Script/FollowPath";

class MagicMissile extends RangeSpell {
  paths: PathPoint[][] = [];

  missileLines: Line[] = [];

  lines: number[][] = [];

  constructor(actor: Actor) {
    super(actor, 3, false, 'Magic Missile', 'Action', 1, feetToMeters(120), 0, false, false)
  }

  clear() {
    super.clear();
    this.showPathLines(null);

    while (this.missileLines.length > 0) {
      this.removeMissileLines();
    }
  }

  cast(script: Script, world: WorldInterface): true {
    for (const target of this.targets) {
      target.takeDamage(diceRoll(1, 4) + 1, false, this.actor, 'Magic Missle', script)
    }

    world.shot.translate[0] = this.paths[0][this.paths[0].length - 1].point[0];
    world.shot.translate[1] = 1;
    world.shot.translate[2] = this.paths[0][this.paths[0].length - 1].point[1];

    world.mainRenderPass.addDrawable(world.shot, 'lit');

    script.entries.push(new FollowPath(world.shot, this.paths[0]))

    return true;
  }

  async prepareInteraction(target: Actor | null, point: Vec4 | null, world: WorldInterface): Promise<void> {
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

    if (world.actionInfoCallback) {
      world.actionInfoCallback({
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

        this.showPathLines(lines);

        this.path = path;
        this.distance = distance;

        this.lines = lines;
      }
    }
    else {
      this.showPathLines(null);
    }
  }

  interact(script: Script, world: WorldInterface) {
    if (this.focused) {
      this.targets.push(this.focused);
      this.paths.push(this.path)
      this.focused = null;
      this.path = [];

      this.addMissileLines(this.lines);
      this.lines = [];

      if (this.targets.length < this.maxTargets) {
        if (world.actionInfoCallback) {
          world.actionInfoCallback({
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

  addMissileLines(lines: number[][]) {
    const world = getWorld();

    if (!this.cleared && lines.length > 0) {
      this.missileLines.push(new Line(lines));
      world.mainRenderPass.addDrawable(this.missileLines[this.missileLines.length - 1], 'line');  
    }
  }

  removeMissileLines() {
    const world = getWorld();

    if (this.missileLines.length > 0) {
      world.mainRenderPass.removeDrawable(this.missileLines[this.missileLines.length - 1], 'line');
      this.missileLines.pop();
    }
  }
}

export default MagicMissile;
