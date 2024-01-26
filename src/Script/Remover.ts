import { ActorInterface, WorldInterface } from "../types";

class Remover implements ActorInterface {
  actor: ActorInterface;

  world: WorldInterface;

  constructor(actor: ActorInterface, world: WorldInterface) {
    this.actor = actor;
    this.world = world;
  }

  async update(elapsedTime: number, timestamp: number): Promise<boolean> {
    this.world.removeActors.push(this.actor);
    return true;
  }
}

export default Remover;
