import React from 'react';

type PropsType = {
  onChange: (charClass: string) => void,
}

const SelectClass: React.FC<PropsType> = ({
  onChange,
}) => {
  const [charClass, setCharClass] = React.useState<string>('Barbarian')

  const handleClassChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    setCharClass(event.target.value)
    onChange(event.target.value)
  }

  return (
    <select value={charClass} onChange={handleClassChange}>
      <option value="Barbarian">Barbarian</option>
      <option value="Bard">Bard</option>
      <option value="Cleric">Cleric</option>
      <option value="Druid">Druid</option>
      <option value="Fighter">Fighter</option>
      <option value="Monk">Monk</option>
      <option value="Paladin">Paladin</option>
      <option value="Ranger">Ranger</option>
      <option value="Rogue">Rogue</option>
      <option value="Sorcerer">Sorcerer</option>
      <option value="Warlock">Warlock</option>
      <option value="Wizard">Wizard</option>
    </select>
  )
}

export default SelectClass;
