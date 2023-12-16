import React from 'react';
import ABSwitch from '../ABSwitch';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';
import { WeaponType } from '../../Character/Equipment/Weapon';
import WeaponSelection from './WeaponSelection';
import WeaponSelectionWrapper from './WeaponSelectionWrapper';

type PropsType = {
  equipment: EquipmentChoices[],
}

const RangerChoices: React.FC<PropsType> = ({
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
        labels={['Scale mail', 'Leather armor']}
        onChange={handleChoice1}
      />
      <ABSwitch
        labels={['Two shortswords', 'Two simple melee weapons']}
        onChange={handleChoice2}
      />
      <WeaponSelectionWrapper>
        <WeaponSelection
          weaponTypes={[WeaponType.Simple]}
          weapons={equipment[1].choices[1].weapons}
          index={0}
        />
        <WeaponSelection
          weaponTypes={[WeaponType.Simple]}
          weapons={equipment[1].choices[1].weapons}
          index={1}
        />
      </WeaponSelectionWrapper>
    </div>
  )
}

export default RangerChoices;
