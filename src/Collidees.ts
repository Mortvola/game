import { Vec4, vec4 } from "wgpu-matrix";
import Actor from "./Character/Actor";
import { isDrawableInterface } from "./Drawables/DrawableInterface";

export type CollisionResult = {
  actor: Actor,
  point: Vec4,
}

class Collidees {
  actors: Actor[] = [];

  detectCollision(p1 : Vec4, p2: Vec4, filter?: (actor: Actor) => boolean): CollisionResult | null {
    const ray = vec4.subtract(p2, p1);
    let best: {
      actor: Actor,
      t: number,
    } | null = null;

    for (const actor of this.actors) {
      if (filter && !filter(actor)) {
        continue;
      }

      if (isDrawableInterface(actor.mesh)) {
        const result = actor.mesh.hitTest(p1, ray);

        if (result && result.t <= 1) {
          if (best === null || best.t > result.t) {
            best = {
              actor,
              t: result.t,
            };
          }
        }
      }
    }

    if (best) {
      return {
        actor: best.actor,
        point: vec4.add(p1, vec4.mulScalar(ray, best.t)),
      };
    }

    return null;
  }

  remove(actor: Actor) {
    const index = this.actors.findIndex((a) => a === actor);

    if (index !== -1) {
      this.actors = [
        ...this.actors.slice(0, index),
        ...this.actors.slice(index + 1),
      ]
    }
  }
}

export default Collidees;
