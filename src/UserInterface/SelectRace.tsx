import React from 'react';

type PropsType = {
  onChange: (race: string) => void,
}

const SelectRace: React.FC<PropsType> = ({
  onChange,
}) => {
  const [race, setRace] = React.useState<string>('Dwarf')

  const handleRaceChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    setRace(event.target.value)
    onChange(event.target.value)
  }

  return (
    <select value={race} onChange={handleRaceChange}>
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
