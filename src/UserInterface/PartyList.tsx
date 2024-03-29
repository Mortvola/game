import React from 'react';
import CharacterEntry from './CharacterEntry';
import styles from './PartyList.module.scss';
import AddCharacter from './AddCharacter/AddCharacter';
import Creature from '../Character/Creature';
import { CharacterInterface, Party } from '../types';

type PropsType = {
  party: Party,
  label: string,
  onSelect: (character: CharacterInterface) => void,
  selected: CharacterInterface | null,
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

  const handleEntryClick = (character: CharacterInterface) => {
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
        { included: false, character, },  
      ],
      automate,
    })

    onSelect(character);
  }

  const handleDelete = (character: CharacterInterface) => {
    const index = party.members.findIndex((m) => m.character === character);

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
      </div>
      <div className={styles.list}>
        {
          party.members.map((m) => (
            <CharacterEntry
              key={m.character.name}
              className={`${styles.listEntry} ${selected === m.character ? styles.selected : ''}`}
              member={m}
              onClick={handleEntryClick}
              onDelete={handleDelete}
            />
          ))
        }
      </div>
      {
        showAddDialog
          ? (
            <AddCharacter
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
