type Key = {
  opponents: number[],
}

type QTable = Map<string, Map<number, number>>;

class QStore {
  store: QTable = new Map();

  static makeKey(state: Key) {
    return JSON.stringify(
      state.opponents.map((a) => a).sort((a, b) => a - b)
    )
  }

  getValue(state: Key, action: number): number {
    const s = this.store.get(QStore.makeKey(state));

    if (s) {
      return s.get(action) ?? 0;
    }

    return 0;
  }

  getBestAction(state: Key): number | null {
    const key = QStore.makeKey(state);
    const s = this.store.get(key);

    let maxValue: number | null = null;
    let bestKey: number | null = null;

    if (s) {
      s.forEach((value, key) => {
        if (maxValue === null || maxValue < value) {
          maxValue = value;
          bestKey = key;
        }
      })
    }

    return bestKey;
  }

  setValue(state: Key, action: number, value: number): void {
    const key = QStore.makeKey(state);
    const s = this.store.get(key);

    if (s) {
      s.set(action, value)
    }
    else {
      this.store.set(key, (new Map<number, number>()).set(action, value))
    }
  }
}

export const qStore = new QStore();

export const worker = new Worker("/worker.js");

export type WorkerMessage = {
  type: 'Rewards' | 'QTable',
  rewards?: number[][],
  qtable?: QTable,
}

worker.addEventListener('message', (evt: MessageEvent<WorkerMessage>) => {
  if (evt.data.type === 'QTable' && evt.data.qtable) {
    qStore.store = evt.data.qtable;
  }
})

export type EpisodeInfo = {
  winningTeam: number,
}

export default QStore;
