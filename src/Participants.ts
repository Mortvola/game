import { Vec4, vec4 } from "wgpu-matrix";
import Actor from "./Character/Actor";
import { abilityModifier, diceRoll } from "./Dice";
import { Party } from "./UserInterface/PartyList";
import Goblin from "./Character/Monsters/Goblin";
import { XPThreshold, xpThresholds } from "./Tables";
import Kobold from "./Character/Monsters/Kobold";
import Creature from "./Character/Creature";

function createParty<Type extends Creature>(thresholds: XPThreshold, c: new (name: string) => Type, name: string): Party {
  const party: Party = {
    members: [],
    automate: true,
    experiencePoints: 0,
  }

  for (;;) {
    party.members.push(new c(`${name} ${party.members.length + 1}`));

    party.experiencePoints = party.members.reduce((sum, c) => (
      sum + c.experiencePoints
    ), 0)

    if (party.experiencePoints === 0) {
      throw new Error('zero experience points')
    }
  
    let total = party.experiencePoints;

    if (party.members.length === 1) {
      total *= 1;
    }
    else if (party.members.length === 2) {
      total *= 1.5;
    }
    else if (party.members.length >= 3 && party.members.length <= 6) {
      total *= 2;
    }
    else if (party.members.length >= 7 && party.members.length <= 10) {
      total *= 2.5;
    }
    else if (party.members.length >= 11 && party.members.length <= 14) {
      total *= 3;
    }
    else {
      total *= 4;
    }

    if (total >= thresholds.medium) {
      break;
    }
  }

  return party;
}

export enum ParticipantsState {
  waiting,
  needsPrep,
  preparing,
  ready,
}

class Participants {
  parties: Party[] = [];

  participants: Actor[][] = [[], []];

  state: ParticipantsState = ParticipantsState.waiting;

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
        actor.initiativeRoll = diceRoll(1, 20) + abilityModifier(actor.character.abilityScores.dexterity);
        this.turns.push(actor);
      }  
    }

    this.turns.sort((a, b) => a.initiativeRoll - b.initiativeRoll);
  }

  async createTeam(team: number, z: number, color: Vec4, teamColor: Vec4): Promise<Actor[]> {
    const actors: Actor[] = [];
    const numPlayers = this.parties[team].members.length;
    const spaceBetween = 4;
    const playerWidth = 4;

    for (let i = 0; i < numPlayers; i += 1) {
      const actor = await Actor.create(this.parties[team].members[i], color, teamColor, team, this.parties[team].automate);

      actor.character.hitPoints = actor.character.maxHitPoints;
      actor.character.conditions = [];
      
      actor.character.spellSlots = [];
      
      for (let spellLevel = 1;; spellLevel += 1) {
        const slots = actor.character.getMaxSpellSlots(spellLevel);

        if (slots === undefined) {
          break;
        }

        actor.character.spellSlots.push(slots)
      }

      actor.sceneNode.translate[0] = (i - ((numPlayers - 1) / 2))
        * spaceBetween + Math.random()
        * (spaceBetween - (playerWidth / 2)) - (spaceBetween - (playerWidth / 2)) / 2;
      actor.sceneNode.translate[2] = z + Math.random() * 10 - 5;

      actors.push(actor);
    }

    return actors;
  }

  async createTeams() {
    const players: Actor[] = await this.createTeam(0, 10, vec4.create(0, 0, 0.5, 1), vec4.create(0, 0.6, 0, 1));

    const thresholds: XPThreshold = {
      easy: 0,
      medium: 0,
      hard: 0,
      deadly: 0,
    }

    for (const member of this.parties[0].members) {
      thresholds.easy += xpThresholds[member.charClass.level].easy;
      thresholds.medium += xpThresholds[member.charClass.level].medium;
      thresholds.hard += xpThresholds[member.charClass.level].hard;
      thresholds.deadly += xpThresholds[member.charClass.level].deadly;
    }

    let party: Party;

    switch (Math.floor(Math.random() * 2)) {
      case 0:
        party = createParty(thresholds, Kobold, 'Kobold');
        break;

      case 1:
        party = createParty(thresholds, Goblin, 'Goblin');
        break;

      default:
        throw new Error('monster type not selected')
    }

    this.parties[1] = party;

    const opponents: Actor[] = await this.createTeam(1, -10, vec4.create(0.5, 0, 0, 1), vec4.create(1, 0, 0, 1));

    this.participants[0] = players;
    this.participants[1] = opponents;
    this.turns = [];
    this.turn = 0;

    this.state = ParticipantsState.ready;
  }

  setParties(parties: Party[]) {
    this.parties = parties;

    if (this.parties[0].members.length > 0) { // && this.parties[1].members.length > 0) {
      this.state = ParticipantsState.needsPrep;
    }
  }
}

export default Participants;
