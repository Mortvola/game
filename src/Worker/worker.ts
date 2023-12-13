/* eslint-disable no-restricted-globals */

import Environment from './Environment';
import QLearn from './QLearn';
import QStore from './QStore';

self.onmessage = (event: MessageEvent<string>) => {
  if (event.data === 'start') {
    learn();
  }
}

const learn = () => {
  const environment = new Environment();

  const qLearn = new QLearn();
  const qStore = new QStore();

  let rewards: number[][] = [];

  const numIterations = 100000;

  for (let iteration = 0; iteration < numIterations; iteration += 1) {
    // console.log(`running iteration ${iteration} `)
    let finished = false;

    environment.createTeams();

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
