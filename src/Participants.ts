import Actor from "./Actor";
import { abilityModifier, diceRoll } from "./Dice";

class Participants {
  participants: Actor[][] = [];

  turns: Actor[] = [];

  turn: number = 0;

  get activeActor() {
    return this.turns[this.turn]
  }

  remove(actor: Actor) {
    const team = this.participants[actor.team];
    let index = team.findIndex((a) => a === actor);

    if (index !== -1) {
      this.participants[actor.team] = [
        ...team.slice(0, index),
        ...team.slice(index + 1),
      ];
    }

    index = this.turns.findIndex((a) => a === actor);

    if (index !== -1) {
      this.turns = [
        ...this.turns.slice(0, index),
        ...this.turns.slice(index + 1),
      ]

      if (this.turn >= index) {
        this.turn -= 1;
      }
    }
  }

  initiativeRolls() {
    for (const team of this.participants) {
      for (const actor of team) {
        actor.initiativeRoll = diceRoll(20) + abilityModifier(actor.dexterity);
        this.turns.push(actor);
      }  
    }

    this.turns.sort((a, b) => a.initiativeRoll - b.initiativeRoll);
  }
}

export default Participants;
