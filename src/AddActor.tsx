import React from 'react';
import styles from './AddActor.module.scss';

type PropsType = {
  show: boolean,
  onHide: () => void,
  onSave: (race: string, charClass: string) => void,
}

const AddActor: React.FC<PropsType> = ({
  show,
  onHide,
  onSave,
}) => {
  const [race, setRace] = React.useState<string>('Dwarf')
  const [charClass, setCharClass] = React.useState<string>('Barbarian')

  const handleSaveClick = () => {
    if (race && charClass) {
      onSave(race, charClass)
    }
  }

  const handleCancelClick = () => {
    onHide()
  }

  const handleRaceChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    setRace(event.target.value)
  }

  const handleClassChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    setCharClass(event.target.value)
  }

  if (show) {
    return (
      <div className={styles.dialog}>
        <div className={styles.body}>
          <label>
            Race
            <select value={race} onChange={handleRaceChange}>
              <option value="Dwarf">Dwarf</option>
              <option value="Elf">Elf</option>
              <option value="Halfling">Halfling</option>
              <option value="HighElf">High Elf</option>
              <option value="HillDwarf">Hill Dwarf</option>
              <option value="Human">Human</option>
              <option value="LightfootHalfling">Lightfoot Halfling</option>
              <option value="MountainDwarf">Mountain Dwarf</option>
              <option value="StoutHalfling">Stout Halfling</option>
              <option value="WoodElf">Wood Elf</option>
            </select>
          </label>
          <label>
            Class
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
          </label>
        </div>
        <div className={styles.footer}>
          <button type="button" onClick={handleCancelClick}>Cancel</button>
          <button type="button" onClick={handleSaveClick}>Save</button>
        </div>
      </div>
    )  
  }

  return null;
}

export default AddActor;
