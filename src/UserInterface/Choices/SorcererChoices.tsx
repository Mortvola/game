import React from 'react';
import ABSwitch from '../ABSwitch';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';
import { WeaponType } from '../../Character/Equipment/Weapon';
import WeaponSelection from './WeaponSelection';
import WeaponSelectionWrapper from './WeaponSelectionWrapper';

type PropsType = {
  equipment: EquipmentChoices[],
}

const SorcererChoices: React.FC<PropsType> = ({
  equipment,
}) => {
  const handleChoice1 = (value: number) => {
    equipment[0].selection = value;
  }

  return (
    <div>
      <ABSwitch
        labels={['A light crossbow & 20 bolts', 'A simple weapon']}
        onChange={handleChoice1}
      />
      <WeaponSelectionWrapper>
        <div />
        <WeaponSelection
          weaponTypes={[WeaponType.Simple]}
          weapons={equipment[0].choices[1].weapons}
          index={0}
        />
      </WeaponSelectionWrapper>
    </div>
  )
}

export default SorcererChoices;
