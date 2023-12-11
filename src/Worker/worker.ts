/* eslint-disable no-restricted-globals */

self.onmessage = (event: MessageEvent<string>) => {
  if (event.data === 'start') {
    learn();
  }
}

class QLearn {
  maxReward = 0;
  rho = 1.0;
  epsilonDecay = 0.9999;
  minRho = 0.02;
  
  alpha = 0.9;
  alphaDecay = 0.9999;
  minAlpha = 0.02;
  
  actionHistory: number[] = [];
  
  maxQDelta: number | null = null;

  iteration = 0;

  totalReward = 0;

  finished = false;

  next() {
    this.iteration += 1;
    this.actionHistory = [];
    this.rho = Math.max(this.rho * this.epsilonDecay, this.minRho);
    this.alpha = Math.max(this.alpha * this.alphaDecay, this.minAlpha);
    this.maxQDelta = null;
    this.totalReward = 0;
    this.finished = false;
  }
}

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
      // console.log('adding new state');
      // for (let i = 0; i < 4; i += 1) {
      //   this.store.set(key, (new Map<number, number>()).set(i, 0))
      // }

      this.store.set(key, (new Map<number, number>()).set(action, value))
    }
  }
}

const qLearn = new QLearn();
const qStore = new QStore();

class Actor {
  hitPoints = 100;

  team: number;

  actionsLeft = 1;

  constructor(team: number) {
    this.team = team;
  }

  playAction(
    action: number | null, otherTeam: Actor[], environment: Environment,
  ): { removedActors: Actor[], reward: number, finished: boolean, action: number } {
    if (action === null || Math.random() < qLearn.rho) {
      action = Math.trunc(Math.random() * otherTeam.length);
    }

    const sortedActors = otherTeam.map((a) => a).sort((a, b) => a.hitPoints - b.hitPoints);

    const target = sortedActors[action];
    const result = this.attack(target, environment);

    return {
      ...result,
      action,
    }
  }
  
  chooseAction(environment: Environment): Actor[] {
    let removedActors: Actor[] = [];
  
    const otherTeam = environment.teams[this.team ^ 1];
    
    const gamma = 0.9;
  
    // Attack a random opponent
    if (otherTeam.length > 0) {
      // Have team 0 stick with random shots while team 1 learns.
    
      if (this.team === 0) {
        const result = this.playAction(null, otherTeam, environment);
  
        removedActors = result.removedActors;
  
        qLearn.finished = result.finished;
      }
      else {
        // const state = Math.trunc((otherTeamSum / 400) * 1000);
        const state = {
          opponents: otherTeam.map((t) => t.hitPoints),
        };
  
        let action = qStore.getBestAction(state);
  
        const result = this.playAction(action, otherTeam, environment);
  
        removedActors = result.removedActors;
        const reward = result.reward;
        const newState = { opponents: environment.teams[this.team ^ 1].map((t) => t.hitPoints) };
        action = result.action;
        qLearn.finished = result.finished;
  
        qLearn.actionHistory.push(action);
      
        let q = qStore.getValue(state, action);
  
        const bestAction = qStore.getBestAction(newState);
        let maxQ = 0;
  
        if (bestAction !== null) {
          maxQ = qStore.getValue(newState, bestAction);
        }
  
        // const oldQ = q;
  
        qLearn.totalReward += reward;
        if (reward > qLearn.maxReward) {
          // console.log(`changed max reward from ${qLearn.maxReward} to ${reward}`)
          qLearn.maxReward = reward
        }  
  
        // if (reward !== 0 && reward === maxReward) {
        //   console.log(`state: ${JSON.stringify(state.opponents)}/${actionType}, alpha: ${alpha}, reward: ${reward}, gamma: ${gamma}, maxQ: ${maxQ}, q: ${q}`)
        // }
  
        const newQ = q + qLearn.alpha * (reward + gamma * maxQ - q);
        const qDelta = newQ - q;
  
        if (qLearn.maxQDelta === null || qDelta > qLearn.maxQDelta ) {
          qLearn.maxQDelta = qDelta;
        }
      
        q = newQ;
  
        // if (newQ !== oldQ) {
        //   console.log(`change ${JSON.stringify(state.opponents)}/${actionType} from ${oldQ} to ${newQ}}`)
        // }
        
        qStore.setValue(state, action, q);  
      }
  
      if (qLearn.finished) {
        // console.log(`${JSON.stringify(qLearn.actionHistory)}, ${qLearn.actionHistory.length}`)
        // console.log(`iteration: ${qLearn.iteration}, rho: ${qLearn.rho}, alpha: ${qLearn.alpha}, qDelta: ${qLearn.maxQDelta}, reward: ${qLearn.totalReward}`);
      }
    }
  
    return removedActors;
  }  

  attack(targetActor: Actor, environment: Environment): { reward: number, finished: boolean, removedActors: Actor[] } {
    this.actionsLeft -= 1;

    const removedActors: Actor[] = [];

    targetActor.hitPoints -= 10;

    if (targetActor.hitPoints <= 0) {
      targetActor.hitPoints = 0;

      removedActors.push(targetActor);
    }

    const otherTeam = environment.teams[this.team ^ 1];
    const otherTeamSum = otherTeam.reduce((accum, a) => {
      return accum + a.hitPoints;
    }, 0)

    const team = environment.teams[this.team];
    const teamSum = team.reduce((accum, a) => {
      return accum + a.hitPoints;
    }, 0)

    return {
      reward: otherTeamSum === 0 ? teamSum * 100 : -1,
      finished: otherTeamSum === 0,
      // newState: Math.trunc((otherTeamSum / 400) * 1000),
      removedActors,
    }
  }
}

class Environment {
  teams: Actor[][] = [];

  turns: Actor[] = [];

  // turn = 0;

  // get activeActor() {
  //   return this.turns[this.turn]
  // }

  createTeams() {
    const team1 = [new Actor(0), new Actor(0), new Actor(0), new Actor(0)];
    const team2 = [new Actor(1), new Actor(1), new Actor(1), new Actor(1)];

    this.teams[0] = team1;
    this.teams[1] = team2;

    this.turns = [
      ...this.teams[0],
      ...this.teams[1],
    ];
  }

  // remove(actor: Actor) {
  //   const team = this.teams[actor.team];
  //   let index = team.findIndex((a) => a === actor);

  //   if (index !== -1) {
  //     this.teams[actor.team] = [
  //       ...team.slice(0, index),
  //       ...team.slice(index + 1),
  //     ];
  //   }

  //   index = this.turns.findIndex((a) => a === actor);

  //   if (index !== -1) {
  //     this.turns = [
  //       ...this.turns.slice(0, index),
  //       ...this.turns.slice(index + 1),
  //     ]

  //     if (this.turn >= index) {
  //       this.turn -= 1;
  //     }
  //   }
  // }
}

let red = 0;
let blue = 0;

const learn = () => {
  const environment = new Environment();

  let rewards: number[][] = [];

  for (let iteration = 0; iteration < 100000; iteration += 1) {
    // console.log(`running iteration ${iteration} `)
    let finished = false;

    environment.createTeams();

    while (!finished) {
      for (let a = 0; a < environment.turns.length; a += 1) {
        const removeActors = environment.turns[a].chooseAction(environment)

        for (let actor of removeActors) {
          const team = environment.teams[actor.team];
          let index = team.findIndex((a) => a === actor);
      
          if (index !== -1) {
            environment.teams[actor.team] = [
              ...team.slice(0, index),
              ...team.slice(index + 1),
            ];
          }
          else {
            console.log('actor not found')
          }
      
          index = environment.turns.findIndex((a) => a === actor);

          if (index !== -1) {
            environment.turns = [
              ...environment.turns.slice(0, index),
              ...environment.turns.slice(index + 1),
            ]

            if (a >= index) {
              a -= 1;
            }    
          }
          else {
            console.log('actor not found')
          }
        }

        if (environment.teams[0].length === 0 ||
          environment.teams[1].length === 0
        ) {
          finished = true;

          if (environment.teams[0].length > 0) {
            blue += 1;
          }
          else if (environment.teams[1].length > 0) {
              red += 1;
          }

          break;
        }
      }
    }

    rewards.push([iteration, qLearn.totalReward]);

    if (rewards.length >= 100) {
      postMessage({
        type: 'Rewards',
        rewards,
      });

      rewards = [];
    }

    qLearn.next();
  }
  
  postMessage({
    type: 'QTable',
    qtable: qStore.store,
  })
}
