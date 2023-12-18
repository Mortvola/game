import { ActorInterface } from "../ActorInterface";
import { WorldInterface } from "../WorldInterface";

class Logger implements ActorInterface {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  update(elapsedTime: number, timestamp: number, world: WorldInterface): ActorInterface[] {
    console.log(this.message);

    return [this];
  }
}

export default Logger;
