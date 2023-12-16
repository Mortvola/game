import React from 'react';
import ABSwitch from '../ABSwitch';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';
import { WeaponType } from '../../Character/Equipment/Weapon';
import WeaponSelection2 from './WeaponSelection';

type PropsType = {
  equipment: EquipmentChoices[],
}

const DruidChoices: React.FC<PropsType> = ({
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
        labels={['A wooden shield', 'A simple weapon']}
        onChange={handleChoice1}
      />
      <WeaponSelection2
        weaponTypes={[WeaponType.Simple, WeaponType.SimpleRange]}
        weapons={equipment[0].choices[1].weapons}
        index={0}
      />
      <ABSwitch
        labels={['A scimitar', 'A simple melee weapon']}
        onChange={handleChoice2}
      />
      <WeaponSelection2
        weaponTypes={[WeaponType.Simple]}
        weapons={equipment[1].choices[1].weapons}
        index={0}
      />
    </div>
  )
}

export default DruidChoices;
