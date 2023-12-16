import React from 'react';
import ABSwitch from '../ABSwitch';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';
import { WeaponType } from '../../Character/Equipment/Weapon';
import WeaponSelection2 from './WeaponSelection';

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
      <WeaponSelection2
        weaponTypes={[WeaponType.Martial, WeaponType.MartialRange]}
        weapons={equipment[0].choices[0].weapons}
        index={0}
      />
      <WeaponSelection2
        weaponTypes={[WeaponType.Martial, WeaponType.MartialRange]}
        weapons={equipment[0].choices[1].weapons}
        index={0}
      />
      <WeaponSelection2
        weaponTypes={[WeaponType.Martial, WeaponType.MartialRange]}
        weapons={equipment[0].choices[1].weapons}
        index={1}
      />
      <ABSwitch
        labels={['Five javelins', 'A simple melee weapon']}
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

export default PaladinChoices;
