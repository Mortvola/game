import { ActorInterface, WorldInterface } from "../types";

class Delay implements ActorInterface {
  startTime: number | null = null;

  duration: number;

  world: WorldInterface;

  constructor(duration: number, world: WorldInterface) {
    this.duration = duration;
    this.world = world;
  }

  async update(elapsedTime: number, timestamp: number): Promise<boolean> {
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
