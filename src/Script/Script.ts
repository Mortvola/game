import { ActorInterface } from "../ActorInterface";
import { WorldInterface } from "../WorldInterface";

class Script implements ActorInterface {
  entries: ActorInterface[] = [];

  onFinish: ((timestamp: number) => void) | null = null;

  update(elapsedTime: number, timestamp: number, world: WorldInterface): ActorInterface[] {
    const removedActors: ActorInterface[] = [];

    if (this.entries.length > 0) {
      const remove = this.entries[0].update(elapsedTime, timestamp, world);

      if (remove.length > 0) {
        this.entries = this.entries.slice(1);

        if (this.entries.length === 0) {
          if (this.onFinish) {
            this.onFinish(timestamp);
          }
  
          removedActors.push(this)  
        }
        else {
          // TODO: consider that the entry removed did not take all of the elapsed time
          // and apply the remainder to the next entry.
        }
      }
    }

    return removedActors;
  }
}

export default Script;
