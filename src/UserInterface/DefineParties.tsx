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

const DefineParties: React.FC<PropsType> = ({
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

  const handleParty1Change = (party: Party) => {
    setNewParties((prev) => {
      return ([
        party,
        prev[1],
      ])
    });
  }

  const handleParty2Change = (party: Party) => {
    setNewParties((prev) => {
      return ([
        prev[0],
        party,
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
            party={parties[0]}
            label="Party 1"
            onSelect={handleSelect}
            selected={selected}
            onPartyChange={handleParty1Change}
          />
          <PartyList
            party={parties[1]}
            label="Party 2"
            onSelect={handleSelect}
            selected={selected}
            onPartyChange={handleParty2Change}
          />
        </div>
        <CharacterDetails character={selected} />
      </div>
    </div>
  )
}

export default DefineParties;
