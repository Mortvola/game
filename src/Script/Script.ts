import { ActorInterface, WorldInterface } from "../types";

class Script implements ActorInterface {
  entries: ActorInterface[] = [];

  onFinish: ((timestamp: number) => void) | null = null;

  world: WorldInterface;

  constructor(world: WorldInterface) {
    this.world = world;
  }

  async update(elapsedTime: number, timestamp: number): Promise<boolean> {
    if (this.entries.length === 0) {
      return true;
    }

    const remove = await this.entries[0].update(elapsedTime, timestamp);

    if (remove) {
      this.entries = this.entries.slice(1);

      if (this.entries.length === 0) {
        if (this.onFinish) {
          this.onFinish(timestamp);
        }

        return true;
      }

      // TODO: consider that the entry removed did not take all of the elapsed time
      // and apply the remainder to the next entry.
    }

    return false;
  }
}

export default Script;
