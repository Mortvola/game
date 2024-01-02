/* eslint-disable no-restricted-globals */

import Character from '../Character/Character';
import { CharacterStorage, restoreCharacters } from '../Character/CharacterStorage';
import Environment from './Environment';
import QLearn from './QLearn';
import QStore, { QTable } from './QStore';

type BaseMessage = {
  type: string,
}

type StartMessage = {
  type: string,
  parties: CharacterStorage[][],
}

type AmmendMessage = {
  type: string,
  parties: CharacterStorage[][],
  store: QTable,
}

let qStore = new QStore();

self.onmessage = (event: MessageEvent<BaseMessage>) => {
  switch (event.data.type) {
    case 'start': {
      const parties = (event.data as StartMessage).parties.map((p) => (
        restoreCharacters(p)
      ))
  
      qStore = new QStore();
  
      learn(parties);
  
      break;
    }

    case 'ammend': {
      const parties = (event.data as AmmendMessage).parties.map((p) => (
        restoreCharacters(p)
      ))
  
      qStore.store = (event.data as AmmendMessage).store;
  
      learn(parties);
  
      break;
    }
  }
}

const learn = (parties: { included: boolean, character: Character }[][]) => {
  const environment = new Environment();

  const qLearn = new QLearn();

  let rewards: number[][] = [];

  for (let iteration = 0; iteration < qLearn.numIterations; iteration += 1) {
    // console.log(`running iteration ${iteration} `)
    let finished = false;

    environment.createTeams(parties);

    while (!finished) {
      for (let a = 0; a < environment.turns.length; a += 1) {
        const removeActors = environment.turns[a].chooseAction(environment, qStore, qLearn)

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

  postMessage({
    type: 'Finished',
  })
}
