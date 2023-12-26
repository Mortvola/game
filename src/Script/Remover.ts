import { ActorInterface } from "../ActorInterface";
import { WorldInterface } from "../WorldInterface";

class Remover implements ActorInterface {
  actor: ActorInterface;

  constructor(actor: ActorInterface) {
    this.actor = actor;
  }

  update(elapsedTime: number, timestamp: number, world: WorldInterface): boolean {
    world.removeActors.push(this.actor);
    return true;
  }
}

export default Remover;
