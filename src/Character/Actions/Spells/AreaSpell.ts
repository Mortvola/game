import { Vec2, Vec4, vec2, vec3 } from "wgpu-matrix";
import Script from "../../../Script/Script";
import RangeSpell from "./RangeSpell";
import { CreatureActorInterface, TimeType } from "../../../types";
import RangeCircle from "../../../Renderer/Drawables/RangeCircle";

class AreaSpell extends RangeSpell {
  center: Vec2 | null = null;

  radius: number;

  areaOfEffect: RangeCircle | null = null;

  constructor(
    actor: CreatureActorInterface,
    name: string,
    time: TimeType,
    level: number,
    radius: number,
    range: number,
    duration: number,
    endOfTurn: boolean,
    concentration: boolean,
  ) {
    super(actor, 1, true, name, time, level, range, duration, endOfTurn, concentration)
    this.radius = radius;
  }

  clear() {
    super.clear();
    this.hideAreaOfEffect()
  }

  async prepareInteraction(target: CreatureActorInterface | null, point: Vec4 | null): Promise<void> {
    if (point !== null) {
      await this.showAreaOfEffect();

      if (this.areaOfEffect) {
        this.areaOfEffect.translate = vec3.create(point[0], 0, point[2])
  
        this.center = vec2.create(point[0], point[2]);
      }  
    }
    else {
      this.hideAreaOfEffect();
    }
  }

  async interact(script: Script): Promise<boolean> {
    if (this.center !== null) {
      return this.castSpell(script);
    }

    return false;
  }

  async showAreaOfEffect() {
    if (this.areaOfEffect === null) {
      this.areaOfEffect = new RangeCircle(vec3.copy(this.actor.sceneObject.sceneNode.translate), this.radius, 0.05)
  
      this.world.renderer.scene.addNode(this.areaOfEffect);  
    }
  }

  hideAreaOfEffect() {
    if (this.areaOfEffect) {
      this.world.renderer.scene.removeNode(this.areaOfEffect)
      this.areaOfEffect = null;
    }
  }
}

export default AreaSpell;
