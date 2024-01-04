import React from 'react';
import SelectRace from './SelectRace';
import { Race } from '../../Character/Races/Race';
import SelectClass from './SelectClass';
import CharacterClass from '../../Character/Classes/CharacterClass';
import Abilities from './Abilities';
import { AbilityScores } from '../../Character/Races/AbilityScores';

type PropsType = {
  race: Race,
  charClass: CharacterClass,
  scores: AbilityScores | null,
  onRaceChange: (race: string) => void,
  onClassChange: (charClass: string) => void,
}

const RaceTab: React.FC<PropsType> = ({
  race,
  charClass,
  scores,
  onRaceChange,
  onClassChange,
}) => (
  <div>
    <SelectRace onChange={onRaceChange} race={race} />
    <SelectClass value={charClass.name} onChange={onClassChange} />
    <Abilities scores={scores} race={race} />
  </div>
)

export default RaceTab;
