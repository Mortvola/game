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

    let r: Race | null = null;

    switch (race) {
      case "Dwarf":
        r = new Dwarf();
        break;
      case "Elf":
        r = new Elf();
        break;
      case "Halfling":
        r = new Halfling();
        break;
      case "HighElf":
        r = new HighElf();
        break;
      case "HillDwarf":
        r = new HillDwarf();
        break;
      case "Human":
        r = new Human();
        break;
      case "LightfootHalfling":
        r = new LightfootHalfling();
        break;
      case "MountainDwarf":
        r = new MountainDwarf();
        break;
      case "StoutHalfling":
        r = new StoutHalfling();
        break;
      case "WoodElf":
        r = new WoodElf();
        break;
    }

    let c: CharacterClass | null = null;

    switch (charClass) {
      case "Barbarian":
        c = new Barbarian();
        break;
      case "Bard":
        c = new Bard();
        break;
      case "Cleric":
        c = new Cleric();
        break;
      case "Druid":
        c = new Druid();
        break;
      case "Fighter":
        c = new Fighter();
        break;
      case "Monk":
        c = new Monk();
        break;
      case "Paladin":
        c = new Paladin();
        break;
      case "Ranger":
        c = new Ranger();
        break;
      case "Rogue":
        c = new Rogue();
        break;
      case "Sorcerer":
        c = new Sorcerer();
        break;
      case "Warlock":
        c = new Warlock();
        break;
      case "Wizard":
        c = new Wizard();
        break;
    }

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
