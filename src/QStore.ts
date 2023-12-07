class QStore {
  store: Map<number, Map<number, number>> = new Map();

  getValue(state: number, action: number): number {
    const s = this.store.get(state);

    if (s) {
      return s.get(action) ?? 0;
    }

    return 0;
  }

  getBestAction(state: number): number | null {
    const s = this.store.get(state);
    let max: number | null = null;

    if (s) {
      s.forEach((v: number) => {
        if (max === null || max < v) {
          max = v;
        }
      })
    }

    return max;
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
