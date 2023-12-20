import { ActorInterface } from "../ActorInterface";
import { WorldInterface } from "../WorldInterface";

class Logger implements ActorInterface {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  update(elapsedTime: number, timestamp: number, world: WorldInterface): ActorInterface[] {
    if (world.loggerCallback) {
      world.loggerCallback(this.message)
    }

    return [this];
  }
}

export default Logger;
