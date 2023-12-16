import React from 'react';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';
import EquipmentChoice from './EquipmentChoice';

type PropsType = {
  equipment: EquipmentChoices[],
}

const StartingEquipment: React.FC<PropsType> = ({
  equipment,
}) => (
  <div>
    {
      equipment.map((e) => (
        <EquipmentChoice equipment={e} />
      ))
    }
  </div>
)

export default StartingEquipment;
