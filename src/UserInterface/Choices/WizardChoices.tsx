import React from 'react';
import ABSwitch from '../ABSwitch';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';

type PropsType = {
  equipment: EquipmentChoices[],
}

const WizardChoices: React.FC<PropsType> = ({
  equipment,
}) => {
  const handleChoice1 = (value: number) => {
    equipment[0].selection = value;
  }

  return (
    <div>
      <ABSwitch
        labels={['A quarterstaff', 'A dagger']}
        onChange={handleChoice1}
      />
    </div>
  )
}

export default WizardChoices;
