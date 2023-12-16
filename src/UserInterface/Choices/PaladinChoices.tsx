import React from 'react';
import ABSwitch from '../ABSwitch';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';
import { WeaponType } from '../../Character/Equipment/Weapon';
import WeaponSelection from './WeaponSelection';
import styles from './StartingEquipment.module.scss';
import WeaponSelectionWrapper from './WeaponSelectionWrapper';

type PropsType = {
  equipment: EquipmentChoices[],
}

const PaladinChoices: React.FC<PropsType> = ({
  equipment,
}) => {
  const handleChoice1 = (value: number) => {
    equipment[0].selection = value;
  }

  const handleChoice2 = (value: number) => {
    equipment[1].selection = value;
  }

  return (
    <div>
      <ABSwitch
        labels={['A martial weapon & shield', 'Two martial weapons']}
        onChange={handleChoice1}
      />
      <WeaponSelectionWrapper>
        <WeaponSelection
          weaponTypes={[WeaponType.Martial, WeaponType.MartialRange]}
          weapons={equipment[0].choices[0].weapons}
          index={0}
        />
        <div className={styles.weaponSelection}>
          <WeaponSelection
            weaponTypes={[WeaponType.Martial, WeaponType.MartialRange]}
            weapons={equipment[0].choices[1].weapons}
            index={0}
          />
          <WeaponSelection
            weaponTypes={[WeaponType.Martial, WeaponType.MartialRange]}
            weapons={equipment[0].choices[1].weapons}
            index={1}
          />
        </div>
      </WeaponSelectionWrapper>
      <ABSwitch
        labels={['Five javelins', 'A simple melee weapon']}
        onChange={handleChoice2}
      />
        <WeaponSelectionWrapper>
          <div></div>
          <WeaponSelection
            weaponTypes={[WeaponType.Simple]}
            weapons={equipment[1].choices[1].weapons}
            index={0}
          />
        </WeaponSelectionWrapper>
    </div>
  )
}

export default PaladinChoices;
