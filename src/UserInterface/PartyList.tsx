import React from 'react';
import CharacterEntry from './CharacterEntry';
import styles from './PartyList.module.scss';
import Character from '../Character/Character';
import AddCharactor from './AddCharacter/AddCharactor';
import Weapon from '../Character/Equipment/Weapon';
import { Armor } from '../Character/Equipment/Armor';
import { getClass, getRace } from '../Character/Utilities';
import Creature from '../Character/Creature';
import { AbilityScores } from '../Character/Races/AbilityScores';

export type Party = {
  members: Creature[],
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

  const handleSave = (character: Creature) => {
    setShowAddDialog(false);

    onPartyChange({
      members: [
        ...party.members,
        character,  
      ],
      automate,
    })

    onSelect(character);
  }

  const handleAutomateChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setAutomate(event.target.checked);
    party.automate = event.target.checked;
  }

  const handleDelete = (character: Character) => {
    const index = party.members.findIndex((c) => c === character);

    if (index !== -1) {
      onPartyChange({
        members: [
          ...party.members.slice(0, index),
          ...party.members.slice(index + 1),
        ],
        automate,
      })  
    }
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
              character={a as Character}
              onClick={handleEntryClick}
              onDelete={handleDelete}
            />
          ))
        }
      </div>
      {
        showAddDialog
          ? (
            <AddCharactor
              show={showAddDialog}
              onHide={handleHideDialog}
              onSave={handleSave}
            />
          )
          : null
      }
    </div>
  )
}

export default PartyList;
