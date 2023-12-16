import React from 'react';
import ABSwitch from '../ABSwitch';
import { WeaponType } from '../../Character/Equipment/Weapon';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';
import WeaponSelection from './WeaponSelection';
import WeaponSelectionWrapper from './WeaponSelectionWrapper';

type PropsType = {
  equipment: EquipmentChoices[],
}

const ClericChoices: React.FC<PropsType> = ({
  equipment,
}) => {
  const handleChoice1 = (value: number) => {
    equipment[0].selection = value;
  }

  const handleChoice2 = (value: number) => {
    equipment[1].selection = value;
  }

  const handleChoice3 = (value: number) => {
    equipment[2].selection = value;
  }

  return (
    <div>
      <ABSwitch
        labels={['A mace', 'A warhammer']}
        onChange={handleChoice1}
      />
      <ABSwitch
        labels={['Scale mail', 'Leather armor', 'Chain mail']}
        onChange={handleChoice2}
      />
      <ABSwitch
        labels={['A light crossbow & 20 bolts', 'A simple weapon']}
        onChange={handleChoice3}
      />
      <WeaponSelectionWrapper>
        <div />
        <WeaponSelection
          weaponTypes={[WeaponType.Simple, WeaponType.SimpleRange]}
          weapons={equipment[2].choices[1].weapons}
          index={0}
        />
      </WeaponSelectionWrapper>
    </div>
  )
}

export default ClericChoices;
