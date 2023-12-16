import React from 'react';
import ABSwitch from '../ABSwitch';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';
import { WeaponType } from '../../Character/Equipment/Weapon';
import WeaponSelection from './WeaponSelection';
import WeaponSelectionWrapper from './WeaponSelectionWrapper';

type PropsType = {
  equipment: EquipmentChoices[],
}

const BarbarianChoices: React.FC<PropsType> = ({
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
        labels={['A great axe', 'A martial melee weapon']}
        onChange={handleChoice1}
      />
      <WeaponSelectionWrapper>
        <div />
        <WeaponSelection
          weaponTypes={[WeaponType.Martial]}
          weapons={equipment[0].choices[1].weapons}
          index={0}
        />
      </WeaponSelectionWrapper>
      <ABSwitch
        labels={['Two handaxes', 'A simple weapon']}
        onChange={handleChoice2}
      />
      <WeaponSelectionWrapper>
        <div />
        <WeaponSelection
          weaponTypes={[WeaponType.Simple, WeaponType.SimpleRange]}
          weapons={equipment[1].choices[1].weapons}
          index={0}
        />
      </WeaponSelectionWrapper>
    </div>
  )
}

export default BarbarianChoices;
