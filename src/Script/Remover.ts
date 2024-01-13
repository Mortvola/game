import { ActorInterface, WorldInterface } from "../types";

class Remover implements ActorInterface {
  actor: ActorInterface;

  constructor(actor: ActorInterface) {
    this.actor = actor;
  }

  async update(elapsedTime: number, timestamp: number, world: WorldInterface): Promise<boolean> {
    world.removeActors.push(this.actor);
    return true;
  }
}

export default Remover;
