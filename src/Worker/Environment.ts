import Character from '../Character/Character';
import { abilityModifier, diceRoll } from '../Dice';
import Actor from './Actor';
import { EnvironmentInterface } from './Interfaces';

class Environment implements EnvironmentInterface {
  teams: Actor[][] = [];

  turns: Actor[] = [];

  createTeams(parties: Character[][]) {
    const team1: Actor[] = [];
    const team2: Actor[] = [];

    for (const character of parties[0]) {
      character.hitPoints = character.maxHitPoints;
      team1.push(new Actor(character, 0))
    }

    for (const character of parties[1]) {
      character.hitPoints = character.maxHitPoints;
      team2.push(new Actor(character, 1))
    }

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
      actor.initiativeRoll = diceRoll(1, 20) + abilityModifier(actor.character.abilityScores.dexterity);
    }

    this.turns.sort((a, b) => a.initiativeRoll - b.initiativeRoll);
  }
}

export default Environment;
