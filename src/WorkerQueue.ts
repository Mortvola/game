import { CharacterStorageParty, characterStorageParties } from "./Character/CharacterStorage";
import QStore, { Key, QTable } from "./Workers/QStore";
import { Party } from "./types";

export const qStore = new QStore();

export const worker = new Worker(new URL("./Workers/worker.ts", import.meta.url));

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
  queue: {
    state: Key,
    parties: CharacterStorageParty[]
  }[] = [];

  state: State = 'Idle';

  start(parties: Party[]) {
    worker.postMessage({
      type: 'start',
      parties: characterStorageParties(parties),
    });

    this.state = 'Learning';
  }

  update(state: Key, parties: Party[]) {
    const storageParties = characterStorageParties(parties);

    for (let i = 0; i < storageParties.length; i += 1) {
      for (let j = 0; j < storageParties[i].members.length; j += 1) {
        storageParties[i].members[j].maxHitPoints = parties[i].members[j].character.hitPoints;
      }
    }

    if (this.state === 'Idle') {
      worker.postMessage({
        type: 'ammend',
        parties: storageParties,
        store: qStore.store,
      });
  
      this.state = 'Learning';
    }
    else {
      const found = this.queue.some((q) => (
        q.state.opponent.every((a, index) => (
          a.hitPoints === state.opponent[index]?.hitPoints
          && a.armorClass === state.opponent[index]?.armorClass
          && a.weapon === state.opponent[index]?.weapon
        ))
      ))

      if (!found) {
        this.queue.push({
          state,
          parties: storageParties,
        })  

        // console.log(`queue length: ${this.queue.length}`)
      }
      // else {
      //   console.log('duplicate state in queue')
      // }
    }
  }

  finished() {
    if (this.queue.length > 0) {
      const entry = this.queue.pop();

      if (entry) {
        worker.postMessage({
          type: 'ammend',
          parties: entry.parties,
          store: qStore.store,
        });
    
        this.state = 'Learning';  
      }

      // console.log(`queue length: ${this.queue.length}`)
    }
    else {
      this.state = 'Idle';
    }
  }
}

export const workerQueue = new WorkerQueue();

export default WorkerQueue;
