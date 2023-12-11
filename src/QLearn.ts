import QStore from "./QStore";

export const qStore = new QStore();

export const worker = new Worker("/worker.js");

export type QTable = Map<string, Map<number, number>>;

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
  iteration: number,
  winningTeam: number,
  alpha: number,
  rho: number,
  totalRewards: number,
}

class QLearn {
  maxReward = 0;
  rho = 0.02;
  epsilonDecay = 0.9999;
  minRho = 0.02;
  
  alpha = 0.02;
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

export const qLearn = new QLearn();

export default QLearn;
