import React from 'react';
import ABSwitch from '../ABSwitch';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';
import { WeaponType } from '../../Character/Equipment/Weapon';
import WeaponSelection2 from './WeaponSelection';

type PropsType = {
  equipment: EquipmentChoices[],
}

const BardChoices: React.FC<PropsType> = ({
  equipment,
}) => {
  const handleChoice1 = (value: number) => {
    equipment[0].selection = value;
  }

  return (
    <div>
      <ABSwitch
        labels={['A rapier', 'A Longsword', 'A simple weapon']}
        onChange={handleChoice1}
      />
      <WeaponSelection2
        weaponTypes={[WeaponType.Simple, WeaponType.SimpleRange]}
        weapons={equipment[0].choices[2].weapons}
        index={0}
      />
    </div>
  )
}

export default BardChoices;
