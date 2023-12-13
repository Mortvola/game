import { Vec4, vec3, vec4 } from "wgpu-matrix";
import Actor from "./Character/Actor";
import { abilityModifier, diceRoll } from "./Dice";

export enum ParticipantsState {
  needsPrep,
  preparing,
  ready,
}

class Participants {
  participants: Actor[][] = [];

  state: ParticipantsState = ParticipantsState.needsPrep;

  turns: Actor[] = [];

  turn: number = 0;

  constructor() {
    this.participants.push([]);
    this.participants.push([]);
  }

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
        actor.initiativeRoll = diceRoll(1, 20) + abilityModifier(actor.abilityScores.dexterity);
        this.turns.push(actor);
      }  
    }

    this.turns.sort((a, b) => a.initiativeRoll - b.initiativeRoll);
  }

  async createParticipants(z: number, color: Vec4, teamColor: Vec4, team: number, automated: boolean): Promise<Actor[]> {
    const actors: Actor[] = [];
    const numPlayers = 4;
    const spaceBetween = 4;
    const playerWidth = 4;

    for (let i = 0; i < numPlayers; i += 1) {
      const actor = await Actor.create(i.toString(), color, teamColor, team, automated);
      actor.mesh.translate[0] = (i - ((numPlayers - 1) / 2))
        * spaceBetween + Math.random()
        * (spaceBetween - (playerWidth / 2)) - (spaceBetween - (playerWidth / 2)) / 2;
      actor.mesh.translate[2] = z + Math.random() * 10 - 5;

      actor.circle.translate = vec3.copy(actor.mesh.translate);
      actor.circle.translate[1] = 0;

      actors.push(actor);
    }

    return actors;
  }

  async createTeams() {
    const players: Actor[] = await this.createParticipants(10, vec4.create(0, 0, 0.5, 1), vec4.create(0, 0.6, 0, 1), 0, true);
    const opponents: Actor[] = await this.createParticipants(-10, vec4.create(0.5, 0, 0, 1), vec4.create(1, 0, 0, 1), 1, true);

    this.participants[0] = players;
    this.participants[1] = opponents;
    this.turns = [];
    this.turn = 0;

    this.state = ParticipantsState.ready;
  }
}

export default Participants;
