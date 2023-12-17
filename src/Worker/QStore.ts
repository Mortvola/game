type Opponent = {
  hitPoints: number,
  weapon: number,
  armorClass: number,
}

export type Key = {
  opponent: Opponent[],
}

export type ActionType = 'HitPoints' | 'Weapon' | 'ArmorClass';

export type Action = {
  type: ActionType,
  opponent: number,
}

export type QTable = Map<string, Map<string, number>>;

class QStore {
  store: QTable = new Map();

  static makeStateKey(state: Key) {
    const key: { hp: number, w: number, ac: number }[] = [];

    const sorted = state.opponent
      .filter((a) => a.hitPoints > 0)
      .map((a) => a)
      .sort((a, b) => {
        if (a.hitPoints === b.hitPoints) {
          // hit points are equal, sort by armore class

          if (a.armorClass === b.armorClass) {
            // armor classes are equal so sort by weapon damage
            return a.weapon - b.weapon;
          }

          return a.armorClass - b.armorClass;
        }

        return a.hitPoints - b.hitPoints
      });

    if (sorted.length > 0) {
      let value = 0;

      key.push({
        hp: value,
        w: sorted[0].weapon,
        ac: sorted[0].armorClass
      });

      for (let i = 1; i < sorted.length; i += 1) {
        if (sorted[i] !== sorted[i - 1]) {
          value += 1;
        }

        key.push({
          hp: value,
          w: sorted[i].weapon,
          ac: sorted[i].armorClass
          });
      }
    }

    return JSON.stringify(key);
  }

  getValue(state: Key, action: Action): number {
    const s = this.store.get(QStore.makeStateKey(state));

    if (s) {
      const actionKey = JSON.stringify(action)
      return s.get(actionKey) ?? 0;
    }

    return 0;
  }

  getBestAction(state: Key): Action | null {
    const key = QStore.makeStateKey(state);
    const s = this.store.get(key);

    let maxValue: number | null = null;
    let bestKey: string | null = null;

    if (s) {
      for (const [key, value] of s) {
        if (maxValue === null || maxValue < value) {
          maxValue = value;
          bestKey = key;
        }
      }

      if (bestKey) {
        const action = JSON.parse(bestKey) as Action;
        return action;
      }  
    }
    
    return null;
  }

  setValue(state: Key, action: Action, value: number): void {
    const key = QStore.makeStateKey(state);
    const s = this.store.get(key);

    if (s) {
      const actionKey = JSON.stringify(action);
      s.set(actionKey, value)
    }
    else {
      const actionKey = JSON.stringify(action);
      this.store.set(key, (new Map<string, number>()).set(actionKey, value))
      // console.log(`added state, number of states: ${this.store.size}`)
    }
  }
}

export default QStore;
