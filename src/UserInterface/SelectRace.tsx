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
      <option value="HighElf">High Elf</option>
      <option value="WoodElf">Wood Elf</option>
      <option value="HillDwarf">Hill Dwarf</option>
      <option value="MountainDwarf">Mountain Dwarf</option>
      <option value="LightfootHalfling">Lightfoot Halfling</option>
      <option value="StoutHalfling">Stout Halfling</option>
    </select>
  )
}

export default SelectRace;
