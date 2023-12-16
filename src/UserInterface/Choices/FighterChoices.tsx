import React from 'react';
import ABSwitch from '../ABSwitch';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';
import { WeaponType } from '../../Character/Equipment/Weapon';
import WeaponSelection2 from './WeaponSelection';

type PropsType = {
  equipment: EquipmentChoices[],
}

const FighterChoices: React.FC<PropsType> = ({
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
        labels={['Chain mail', 'Leather armor, long bow, & 20 arrows']}
        value={equipment[0].selection}
        onChange={handleChoice1}
      />
      <ABSwitch
        labels={['A martial weapon and shield', 'Two martial weapons']}
        value={equipment[1].selection}
        onChange={handleChoice2}
      />
      <WeaponSelection2
        weaponTypes={[WeaponType.Martial, WeaponType.MartialRange]}
        weapons={equipment[1].choices[0].weapons}
        index={0}
      />
      <WeaponSelection2
        weaponTypes={[WeaponType.Martial, WeaponType.MartialRange]}
        weapons={equipment[1].choices[1].weapons}
        index={0}
      />
      <WeaponSelection2
        weaponTypes={[WeaponType.Martial, WeaponType.MartialRange]}
        weapons={equipment[1].choices[1].weapons}
        index={1}
      />
      <ABSwitch
        labels={['A light crossbow & 20 bolts', 'Two handaxes']}
        value={equipment[2].selection}
        onChange={handleChoice3}
      />
    </div>
  )
}

export default FighterChoices;
