import Character from "./Character/Character";
import { CharacterStorage, characterStorageParties } from "./Character/CharacterStorage";
import QStore, { QTable } from "./Worker/QStore";

export const qStore = new QStore();

export const worker = new Worker(new URL("./Worker/worker.ts", import.meta.url));

export type WorkerMessage = {
  type: 'Rewards' | 'QTable' | 'Finished',
  rewards?: number[][],
  qtable?: QTable,
}

worker.addEventListener('message', (evt: MessageEvent<WorkerMessage>) => {
  if (evt.data.type === 'QTable' && evt.data.qtable) {
    qStore.store = evt.data.qtable;
  }
})

type State = 'Idle' | 'Learning';

class WorkerQueue {
  queue: CharacterStorage[][][] = [];

  state: State = 'Idle';

  start(parties: Character[][]) {
    worker.postMessage({
      type: 'start',
      parties: characterStorageParties(parties),
    });

    this.state = 'Learning';
  }

  update(parties: Character[][]) {
    if (this.state === 'Idle') {
      worker.postMessage({
        type: 'ammend',
        parties: characterStorageParties(parties),
        store: qStore.store,
      });
  
      this.state = 'Learning';
    }
    else {
      this.queue.push(characterStorageParties(parties))
    }
  }

  finished() {
    if (this.queue.length > 0) {
      const parties = this.queue.pop();

      worker.postMessage({
        type: 'ammend',
        parties: parties,
        store: qStore.store,
      });
  
      this.state = 'Learning';
    }
    else {
      this.state = 'Idle';
    }
  }
}

export const workerQueue = new WorkerQueue();

export default WorkerQueue;
