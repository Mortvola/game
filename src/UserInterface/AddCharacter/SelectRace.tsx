import React from 'react';
import { RaceInterface } from '../../types';

type PropsType = {
  race: RaceInterface,
  onChange: (race: string) => void,
}

const SelectRace: React.FC<PropsType> = ({
  race,
  onChange,
}) => {
  const [raceName, setRaceName] = React.useState<string>(race.name)

  const handleRaceChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    setRaceName(event.target.value)
    onChange(event.target.value)
  }

  return (
    <select value={raceName} onChange={handleRaceChange}>
      {/* <option value="Dwarf">Dwarf</option> */}
      {/* <option value="Elf">Elf</option> */}
      {/* <option value="Halfling">Halfling</option> */}
      <option value="Human">Human</option>
      <option value="High Elf">High Elf</option>
      <option value="Wood Elf">Wood Elf</option>
      <option value="Hill Dwarf">Hill Dwarf</option>
      <option value="Mountain Dwarf">Mountain Dwarf</option>
      <option value="Lightfoot Halfling">Lightfoot Halfling</option>
      <option value="Stout Halfling">Stout Halfling</option>
    </select>
  )
}

export default SelectRace;
