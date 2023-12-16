import React from 'react';
import styles from './AddActor.module.scss';
import SelectClass from './SelectClass';
import SelectRace from './SelectRace';
import FighterChoices from './Choices/FighterChoices';
import BarbarianChoices from './Choices/BarbarianChoices';
import BardChoices from './Choices/BardChoices';
import ClericChoices from './Choices/ClericChoices';
import DruidChoices from './Choices/DruidChoices';
import MonkChoices from './Choices/MonkChoices';
import PaladinChoices from './Choices/PaladinChoices';
import RangerChoices from './Choices/RangerChoices';
import RogueChoices from './Choices/RogueChoices';
import SorcererChoices from './Choices/SorcererChoices';
import WarlockChoices from './Choices/WarlockChoices';
import WizardChoices from './Choices/WizardChoices';
import Fighter from '../Character/Classes/Fighter';
import { StartingEquipment } from '../Character/Classes/CharacterClass';
import Weapon from '../Character/Equipment/Weapon';
import { Armor } from '../Character/Equipment/Armor';
import Barbarian from '../Character/Classes/Barbarian';
import Bard from '../Character/Classes/Bard';
import Cleric from '../Character/Classes/Cleric';
import Druid from '../Character/Classes/Druid';
import Monk from '../Character/Classes/Monk';
import Paladin from '../Character/Classes/Paladin';
import Ranger from '../Character/Classes/Ranger';
import Rogue from '../Character/Classes/Rogue';
import Sorcerer from '../Character/Classes/Sorcerer';
import Warlock from '../Character/Classes/Warlock';
import Wizard from '../Character/Classes/Wizard';

type PropsType = {
  show: boolean,
  onHide: () => void,
  onSave: (race: string, charClass: string, weapons: Weapon[], armor: Armor[]) => void,
}

const AddActor: React.FC<PropsType> = ({
  show,
  onHide,
  onSave,
}) => {
  const [race, setRace] = React.useState<string>('Human')
  const [charClass, setCharClass] = React.useState<string>('Barbarian')
  const [equipment, setEquipment] = React.useState<StartingEquipment>(Barbarian.startingEquipment());

  const handleSaveClick = () => {
    if (race && charClass) {
      let weapons: Weapon[] = [];
      let armor: Armor[] = [];

      for (const choice of equipment.equipmentChoices) {
        weapons = weapons.concat(choice.choices[choice.selection].weapons);
        armor = armor.concat(choice.choices[choice.selection].armor);
      }

      weapons = weapons.concat(equipment.other.weapons);
      armor = armor.concat(equipment.other.armor);  

      onSave(race, charClass, weapons, armor)
    }
  }

  const handleCancelClick = () => {
    onHide()
  }

  const handleSelectClass = (charClass: string) => {
    setCharClass(charClass);

    switch(charClass) {
      case "Barbarian":
        setEquipment(Barbarian.startingEquipment())
        break;

      case "Bard":
        setEquipment(Bard.startingEquipment())
        break;

      case "Cleric":
        setEquipment(Cleric.startingEquipment())
        break;

      case "Druid":
        setEquipment(Druid.startingEquipment())
        break;

      case "Fighter":
        setEquipment(Fighter.startingEquipment())
        break;

      case "Monk":
        setEquipment(Monk.startingEquipment())
        break;

      case "Paladin":
        setEquipment(Paladin.startingEquipment())
        break;

      case "Ranger":
        setEquipment(Ranger.startingEquipment())
        break;

      case "Rogue":
        setEquipment(Rogue.startingEquipment())
        break;

      case "Sorcerer":
        setEquipment(Sorcerer.startingEquipment())
        break;

      case "Warlock":
        setEquipment(Warlock.startingEquipment())
        break;

      case "Wizard":
        setEquipment(Wizard.startingEquipment())
        break;

      default:
        break;
    }
  }

  if (show) {
    const renderChoices = () => {
      switch(charClass) {
        case "Barbarian":
          return <BarbarianChoices equipment={equipment.equipmentChoices} />

        case "Bard":
          return <BardChoices equipment={equipment.equipmentChoices} />

        case "Cleric":
          return <ClericChoices equipment={equipment.equipmentChoices} />
  
        case "Druid":
          return <DruidChoices equipment={equipment.equipmentChoices} />
  
        case "Fighter":
          return <FighterChoices equipment={equipment.equipmentChoices} />

        case "Monk":
          return <MonkChoices equipment={equipment.equipmentChoices} />

        case "Paladin":
          return <PaladinChoices equipment={equipment.equipmentChoices} />

        case "Ranger":
          return <RangerChoices equipment={equipment.equipmentChoices} />

        case "Rogue":
          return <RogueChoices equipment={equipment.equipmentChoices} />

        case "Sorcerer":
          return <SorcererChoices equipment={equipment.equipmentChoices} />

        case "Warlock":
          return <WarlockChoices equipment={equipment.equipmentChoices} />

        case "Wizard":
          return <WizardChoices equipment={equipment.equipmentChoices} />

        default:
          return null;
      }
    }

    return (
      <div className={styles.dialog}>
        <div className={styles.body}>
          <div className={styles.raceClass}>
            <label>
              Race
              <SelectRace onChange={setRace} />
            </label>
            <label>
              Class
              <SelectClass onChange={handleSelectClass} />
            </label>
          </div>
          {
            renderChoices()
          }
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
