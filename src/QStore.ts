class QStore {
  store: Map<number, Map<number, number>> = new Map();

  iteration = 0;

  getValue(state: number, action: number): number {
    const s = this.store.get(state);

    if (s) {
      return s.get(action) ?? 0;
    }

    return 0;
  }

  getBestAction(state: number): number | null {
    const s = this.store.get(state);
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

  setValue(state: number, action: number, value: number): void {
    const s = this.store.get(state);

    if (s) {
      s.set(action, value)
    }
    else {
      this.store.set(state, (new Map<number, number>()).set(action, value))
    }
  }
}

export default QStore;
