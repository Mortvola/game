import React from 'react';
import styles from './DefineParties.module.scss'
import Character from '../Character/Character';
import CharacterDetails from './Details/CharacterDetails';
import PartyList, { Party } from './PartyList';

type PropsType = {
  parties: Party[],
  onHide: () => void,
  onSave: (parties: Party[]) => void,
}

const DefineParty: React.FC<PropsType> = ({
  parties,
  onHide,
  onSave,
}) => {
  const [newParties, setNewParties] = React.useState<Party[]>(parties);
  const [selected, setSelected] = React.useState<Character | null>(null);

  const handleSaveClick = () => {
    onSave(newParties)
  }

  const handleCancelClick = () => {
    onHide()
  }

  const handleSelect = (character: Character) => {
    setSelected(character);
  }

  const handlePartyChange = (party: Party) => {
    setNewParties((prev) => {
      return ([
        party,
        prev[1],
      ])
    });
  }

  return (
    <div className={styles.defParties}>
      <button onClick={handleSaveClick}>Save</button>
      <button onClick={handleCancelClick}>Cancel</button>
      <div className={styles.wrapper}>
        <div className={styles.teamWrapper}>
          <PartyList
            party={newParties[0]}
            label="Party 1"
            onSelect={handleSelect}
            selected={selected}
            onPartyChange={handlePartyChange}
          />
        </div>
        <CharacterDetails character={selected} />
      </div>
    </div>
  )
}

export default DefineParty;
