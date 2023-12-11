export type Key = {
  opponents: number[],
}

class QStore {
  store: Map<string, Map<number, number>> = new Map();

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
      // console.log('adding new state');
      // for (let i = 0; i < 4; i += 1) {
      //   this.store.set(key, (new Map<number, number>()).set(i, 0))
      // }

      this.store.set(key, (new Map<number, number>()).set(action, value))
    }
  }
}

export default QStore;
