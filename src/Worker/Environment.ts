import { abilityModifier, diceRoll } from '../Dice';
import Actor from './Actor';
import { EnvironmentInterface } from './Interfaces';

class Environment implements EnvironmentInterface {
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
    
    this.initiativeRolls();
  }

  initiativeRolls() {
    for (const actor of this.turns) {
      actor.initiativeRoll = diceRoll(20) + abilityModifier(actor.dexterity);
    }

    this.turns.sort((a, b) => a.initiativeRoll - b.initiativeRoll);
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

export default Environment;
