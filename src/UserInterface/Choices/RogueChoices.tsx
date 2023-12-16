import React from 'react';
import ABSwitch from '../ABSwitch';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';

type PropsType = {
  equipment: EquipmentChoices[],
}

const RogueChoices: React.FC<PropsType> = ({
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
        labels={['A rapier', 'A shortsword']}
        onChange={handleChoice1}
      />
      <ABSwitch
        labels={['A shortbow & 20 arrows', 'A shortsword']}
        onChange={handleChoice2}
      />
    </div>
  )
}

export default RogueChoices;
