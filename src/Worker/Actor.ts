import { weaponDamage } from "../Character/Equipment/Weapon";
import { ActorInterface, EnvironmentInterface } from "./Interfaces";
import QLearn from "./QLearn";
import QStore, { Action, ActionType, Key } from "./QStore";
import Character from "../Character/Character";
import { attackRoll } from "../Dice";

class Actor implements ActorInterface {
  character: Character;

  team: number;

  actionsLeft = 1;

  initiativeRoll = 0;

  constructor(character: Character,team: number) {
    this.character = character;
    this.team = team;
  }

  takeAction(
    action: Action | null, otherTeam: ActorInterface[], environment: EnvironmentInterface,
    qLearn: QLearn,
  ): { removedActors: ActorInterface[], reward: number, finished: boolean, action: Action } {
    if (action === null || Math.random() < qLearn.rho) {
      const actionType = Math.trunc(Math.random() * 3);

      action = {
        type: ['HitPoints', 'ArmorClass', 'Weapon'][actionType] as ActionType,
        opponent: Math.trunc(Math.random() * otherTeam.length),
      }
    }

    let sortedActors: ActorInterface[] = [];

    switch (action.type) {
      case 'HitPoints':
        sortedActors = otherTeam.map((a) => a).sort((a, b) => a.character.hitPoints - b.character.hitPoints);
        break;

      case 'ArmorClass':
        sortedActors = otherTeam.map((a) => a).sort((a, b) => a.character.armorClass - b.character.armorClass);
        break;

      case 'Weapon':
        sortedActors = otherTeam.map((a) => a).sort((a, b) => {
          const damageA = ((a.character.equipped.meleeWeapon!.die[0].die + 1) / 2) * a.character.equipped.meleeWeapon!.die[0].numDice
          const damageB = ((b.character.equipped.meleeWeapon!.die[0].die + 1) / 2) * b.character.equipped.meleeWeapon!.die[0].numDice
          return damageA - damageB
        });
        break;

      default:
        console.log('action type not handled')
    }

    const target = sortedActors[action.opponent];
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
        const state: Key = {
          opponent: otherTeam.map((t) => ({
            hitPoints: t.character.hitPoints,
            weapon: ((t.character.equipped.meleeWeapon!.die[0].die + 1) / 2) * t.character.equipped.meleeWeapon!.die[0].numDice,
            armorClass: t.character.armorClass,
        })),
        };

        let action = qStore.getBestAction(state);
        const result = this.takeAction(action, otherTeam, environment, qLearn);
  
        removedActors = result.removedActors;
        const reward = result.reward;

        const newState: Key = {
          opponent: environment.teams[this.team ^ 1]
            .filter((t) => t.character.hitPoints !== 0)
            .map((t) => ({
              hitPoints: t.character.hitPoints,
              weapon: ((t.character.equipped.meleeWeapon!.die[0].die + 1) / 2) * t.character.equipped.meleeWeapon!.die[0].numDice,
              armorClass: t.character.armorClass,
            })),
        };

        action = result.action;
        qLearn.finished = result.finished;
  
        // qLearn.actionHistory.push(action);
      
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

    if (this.character.equipped.meleeWeapon) {
      const roll = attackRoll(targetActor.character.armorClass, this.character.abilityScores.dexterity);

      if (roll === 'Hit' || roll === 'Critical') {
        let damage = weaponDamage(this.character.equipped.meleeWeapon, this.character.abilityScores, false);
  
        if (roll === 'Critical') {
          damage = weaponDamage(this.character.equipped.meleeWeapon, this.character.abilityScores, false);
        }

        targetActor.character.hitPoints -= damage;

        if (targetActor.character.hitPoints <= 0) {
          targetActor.character.hitPoints = 0;
    
          removedActors.push(targetActor);
        }
      }
    }

    const otherTeam = environment.teams[this.team ^ 1];
    const otherTeamSum = otherTeam.reduce((accum, a) => {
      return accum + a.character.hitPoints;
    }, 0)

    const team = environment.teams[this.team];
    const teamSum = team.reduce((accum, a) => {
      return accum + a.character.hitPoints;
    }, 0)

    return {
      reward: otherTeamSum === 0 ? teamSum : -1,
      finished: otherTeamSum === 0,
      removedActors,
    }
  }
}

export default Actor;
