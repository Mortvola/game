import { ActorInterface, WorldInterface } from "../types";

class Logger implements ActorInterface {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  async update(elapsedTime: number, timestamp: number, world: WorldInterface): Promise<boolean> {
    if (world.loggerCallback) {
      world.loggerCallback(this.message)
    }

    return true;
  }
}

export default Logger;
