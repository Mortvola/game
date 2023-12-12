type Key = {
  opponents: number[],
}

export type QTable = Map<string, Map<number, number>>;

class QStore {
  store: QTable = new Map();

  static makeKey(state: Key) {
    const sorted = 
      state.opponents.map((a) => a).sort((a, b) => a - b);

    const key = [];
    let value = 0;

    key.push(value);

    for (let i = 1; i < sorted.length; i += 1) {
      if (sorted[i] === sorted[i - 1]) {
        key.push(value)
      }
      else {
        value += 1;
        key.push(value);
      }
    }

    return JSON.stringify(key);
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
      // console.log('adding new state');
      // for (let i = 0; i < 4; i += 1) {
      //   this.store.set(key, (new Map<number, number>()).set(i, 0))
      // }

      this.store.set(key, (new Map<number, number>()).set(action, value))
    }
  }
}

export default QStore;
