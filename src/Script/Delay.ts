import { ActorInterface } from "../ActorInterface";
import { WorldInterface } from "../WorldInterface";

class Delay implements ActorInterface {
  startTime: number | null = null;

  duration: number;

  constructor(duration: number) {
    this.duration = duration;
  }

  async update(elapsedTime: number, timestamp: number, world: WorldInterface): Promise<boolean> {
    if (this.startTime === null) {
      this.startTime = timestamp;
    }
    else {
      if (this.startTime + this.duration < timestamp) {
        return true;
      }
    }

    return false;
  }
}

export default Delay;
