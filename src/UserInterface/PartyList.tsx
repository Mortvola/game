import React from 'react';
import CharacterEntry from './CharacterEntry';
import styles from './PartyList.module.scss';
import Character from '../Character/Character';
import AddCharactor from './AddCharactor';
import { Race } from '../Character/Races/Race';
import Dwarf from '../Character/Races/Dwarf';
import Elf from '../Character/Races/Elf';
import HighElf from '../Character/Races/HighElf';
import HillDwarf from '../Character/Races/HillDwarf';
import Human from '../Character/Races/Human';
import Halfling from '../Character/Races/Halfling';
import MountainDwarf from '../Character/Races/MountainDwarf';
import LightfootHalfling from '../Character/Races/LightfootHalfling';
import StoutHalfling from '../Character/Races/StoutHalfling';
import WoodElf from '../Character/Races/WoodElf';
import CharacterClass from '../Character/Classes/CharacterClass';
import Barbarian from '../Character/Classes/Barbarian';
import Bard from '../Character/Classes/Bard';
import Cleric from '../Character/Classes/Cleric';
import Druid from '../Character/Classes/Druid';
import Fighter from '../Character/Classes/Fighter';
import Monk from '../Character/Classes/Monk';
import Paladin from '../Character/Classes/Paladin';
import Ranger from '../Character/Classes/Ranger';
import Rogue from '../Character/Classes/Rogue';
import Sorcerer from '../Character/Classes/Sorcerer';
import Warlock from '../Character/Classes/Warlock';
import Wizard from '../Character/Classes/Wizard';
import Weapon from '../Character/Equipment/Weapon';
import { Armor } from '../Character/Equipment/Armor';
import { getClass, getRace } from '../Character/Utilities';

type PropsType = {
  party: Character[],
  label: string,
  onSelect: (character: Character) => void,
  selected: Character | null,
  onPartyChange: (party: Character[]) => void,
}

const PartyList: React.FC<PropsType> = ({
  party,
  label,
  onSelect,
  selected,
  onPartyChange,
}) => {
  const [showAddDialog, setShowAddDialog] = React.useState<boolean>(false);

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

      onPartyChange([
        ...party,
        character,
      ])

      onSelect(character);
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
          party.map((a) => (
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
