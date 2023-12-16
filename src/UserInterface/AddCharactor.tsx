import React from 'react';
import styles from './AddCharactor.module.scss';
import SelectClass from './SelectClass';
import SelectRace from './SelectRace';
import Fighter from '../Character/Classes/Fighter';
import { StartingEquipment as StartingEquipmentTable } from '../Character/Classes/CharacterClass';
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
import StartingEquipment from './Choices/StartingEquipment';

type PropsType = {
  show: boolean,
  onHide: () => void,
  onSave: (race: string, charClass: string, weapons: Weapon[], armor: Armor[]) => void,
}

const AddCharactor: React.FC<PropsType> = ({
  show,
  onHide,
  onSave,
}) => {
  const [race, setRace] = React.useState<string>('Human')
  const [charClass, setCharClass] = React.useState<string>('Barbarian')
  const [equipment, setEquipment] = React.useState<StartingEquipmentTable>(Barbarian.startingEquipment());

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
              <SelectClass value={charClass} onChange={handleSelectClass} />
            </label>
          </div>
          <StartingEquipment startingEquipment={equipment} />
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

export default AddCharactor;
