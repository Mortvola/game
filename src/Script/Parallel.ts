import { ActorInterface, WorldInterface } from "../types";
import Script from "./Script";

class Parallel implements ActorInterface {
  entries: Script[] = [];

  world: WorldInterface;
  
  constructor(world: WorldInterface) {
    this.world = world;
  }

  async update(elapsedTime: number, timestamp: number): Promise<boolean> {
    if (this.entries.length === 0) {
      return true;
    }

    for (let i = 0; i < this.entries.length; i += 1) {
      const remove = await this.entries[i].update(elapsedTime, timestamp);

      if (remove) {
        this.entries = [
          ...this.entries.slice(0, i),
          ...this.entries.slice(i + 1),
        ]

        i -= 1;
      }        
    }

    if (this.entries.length === 0) {
      return true;
    }

    return false;
  }
}

export default Parallel;
