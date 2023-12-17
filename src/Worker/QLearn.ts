class QLearn {
  numIterations = 100000;

  maxReward = 0;
  rho = 1.0;
  epsilonDecay = 0.99999;
  minRho = 0.5;
  
  alpha = 0.9;
  alphaDecay = 0.99999;
  minAlpha = 0.02;
  
  gamma = 0.9;

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

export default QLearn;
