import React from 'react';
import SelectRace from './SelectRace';
import { Race } from '../../Character/Races/Race';

type PropsType = {
  race: Race,
  onChange: (race: string) => void,
}

const RaceTab: React.FC<PropsType> = ({
  race,
  onChange,
}) => (
  <SelectRace onChange={onChange} race={race} />
)

export default RaceTab;
