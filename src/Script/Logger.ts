import { ActorInterface, WorldInterface } from "../types";

class Logger implements ActorInterface {
  message: string;

  world: WorldInterface;

  constructor(message: string, world: WorldInterface) {
    this.message = message;
    this.world = world;
  }

  async update(elapsedTime: number, timestamp: number): Promise<boolean> {
    if (this.world.loggerCallback) {
      this.world.loggerCallback(this.message)
    }

    return true;
  }
}

export default Logger;
