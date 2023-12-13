import { abilityRoll } from "../Dice";
import LongBow from "../Weapons/LongBow";
import { ActorInterface, EnvironmentInterface } from "./Interfaces";
import QLearn from "./QLearn";
import QStore from "./QStore";

class Actor implements ActorInterface {
  hitPoints = 100;

  weapon = new LongBow();

  team: number;

  actionsLeft = 1;

  initiativeRoll = 0;

  dexterity = 11; // abilityRoll();

  constructor(team: number) {
    this.team = team;
  }

  takeAction(
    action: number | null, otherTeam: ActorInterface[], environment: EnvironmentInterface,
    qLearn: QLearn,
  ): { removedActors: ActorInterface[], reward: number, finished: boolean, action: number } {
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
  
  chooseAction(environment: EnvironmentInterface, qStore: QStore, qLearn: QLearn): ActorInterface[] {
    let removedActors: ActorInterface[] = [];
  
    const otherTeam = environment.teams[this.team ^ 1];
      
    // Attack a random opponent
    if (otherTeam.length > 0) {
      // Have team 0 stick with random shots while team 1 learns.
    
      if (this.team === 0) {
        const result = this.takeAction(null, otherTeam, environment, qLearn);
  
        removedActors = result.removedActors;
  
        qLearn.finished = result.finished;
      }
      else {
        // const state = Math.trunc((otherTeamSum / 400) * 1000);
        const state = {
          opponents: otherTeam.map((t) => t.hitPoints),
        };

        let action = qStore.getBestAction(state);
        const result = this.takeAction(action, otherTeam, environment, qLearn);
  
        removedActors = result.removedActors;
        const reward = result.reward;

        const newState = {
          opponents: environment.teams[this.team ^ 1]
            .filter((t) => t.hitPoints !== 0)
            .map((t) => t.hitPoints),
        };

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
  
        const newQ = q + qLearn.alpha * (reward + qLearn.gamma * maxQ - q);
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
        qLearn.totalReward += environment.teams[1].length * 100;
        // console.log(`${JSON.stringify(qLearn.actionHistory)}, ${qLearn.actionHistory.length}`)
        // console.log(`iteration: ${qLearn.iteration}, rho: ${qLearn.rho}, alpha: ${qLearn.alpha}, qDelta: ${qLearn.maxQDelta}, reward: ${qLearn.totalReward}`);
      }
    }
  
    return removedActors;
  }  

  attack(
    targetActor: ActorInterface, environment: EnvironmentInterface,
  ): { reward: number, finished: boolean, removedActors: ActorInterface[] } {
    this.actionsLeft -= 1;

    const removedActors: ActorInterface[] = [];

    targetActor.hitPoints -= this.weapon.damage(this.dexterity);

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
      reward: otherTeamSum === 0 ? teamSum : -1,
      finished: otherTeamSum === 0,
      // newState: Math.trunc((otherTeamSum / 400) * 1000),
      removedActors,
    }
  }
}

export default Actor;
