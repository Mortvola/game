import React from 'react';
import ABSwitch from '../ABSwitch';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';
import WeaponSelectionWrapper from './WeaponSelectionWrapper';
import WeaponSelection from './WeaponSelection';
import styles from './StartingEquipment.module.scss';

type PropsType = {
  equipment: EquipmentChoices,
}

const EquipmentChoice: React.FC<PropsType> = ({
  equipment,
}) => {
  const handleChoice = (value: number) => {
    equipment.selection = value;
  }

  return (
    <div>
      <ABSwitch
        labels={equipment.choices.map((c) => c.label)}
        onChange={handleChoice}
      />
      <WeaponSelectionWrapper>
        {
          equipment.choices.map((c) => (
            <div className={styles.weaponSelection}>
              {
                c.selections.map((s, index) => (
                  <WeaponSelection
                    weaponTypes={s}
                    weapons={c.weapons}
                    index={index}
                  />  
                ))
              }
            </div>  
          ))
        }
      </WeaponSelectionWrapper>
    </div>
  )
}

export default EquipmentChoice;
