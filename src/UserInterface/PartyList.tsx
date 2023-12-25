import React from 'react';
import CharacterEntry from './CharacterEntry';
import styles from './PartyList.module.scss';
import Character from '../Character/Character';
import AddCharactor from './AddCharactor';
import Weapon from '../Character/Equipment/Weapon';
import { Armor } from '../Character/Equipment/Armor';
import { getClass, getRace } from '../Character/Utilities';

export type Party = {
  members: Character[],
  automate: boolean,
}

type PropsType = {
  party: Party,
  label: string,
  onSelect: (character: Character) => void,
  selected: Character | null,
  onPartyChange: (party: Party) => void,
}

const PartyList: React.FC<PropsType> = ({
  party,
  label,
  onSelect,
  selected,
  onPartyChange,
}) => {
  const [showAddDialog, setShowAddDialog] = React.useState<boolean>(false);
  const [automate, setAutomate] = React.useState<boolean>(false);

  const handleEntryClick = (character: Character) => {
    onSelect(character)
  }

  const handleHideDialog = () => {
    setShowAddDialog(false);
  }

  const handleAddTeam1 = () => {
    setShowAddDialog(true);
  }

  const handleSave = (race: string, charClass: string, weapons: Weapon[], armor: Armor[]) => {
    setShowAddDialog(false);

    const r = getRace(race);
    const c = getClass(charClass);

    if (r && c) {
      const character = new Character(r, c, weapons, armor);

      onPartyChange({
        members: [
          ...party.members,
          character,  
        ],
        automate,
      })

      onSelect(character);
    }
  }

  const handleAutomateChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setAutomate(event.target.checked);
    party.automate = event.target.checked;
  }

  return (
    <div className={styles.listWrapper}>
      <div className={styles.header}>
        {label}
        <button onClick={handleAddTeam1}>Add</button>
        <label>
          <input type="checkbox" checked={party.automate} onChange={handleAutomateChange} />
          Automate
        </label>
      </div>
      <div className={styles.list}>
        {
          party.members.map((a) => (
            <CharacterEntry
              className={`${styles.listEntry} ${selected === a ? styles.selected : ''}`}
              character={a}
              onClick={handleEntryClick}
            />
          ))
        }
      </div>
      <AddCharactor show={showAddDialog} onHide={handleHideDialog} onSave={handleSave} />
    </div>
  )
}

export default PartyList;
