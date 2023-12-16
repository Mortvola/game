import React from 'react';
import ABSwitch from '../ABSwitch';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';
import WeaponSelection from './WeaponSelection';
import Weapon, { WeaponType } from '../../Character/Equipment/Weapon';

type PropsType = {
  equipment: EquipmentChoices[],
}

const SorcererChoices: React.FC<PropsType> = ({
  equipment,
}) => {
  const handleChoice1 = (value: number) => {
    equipment[0].selection = value;
  }

  const [weaponChoice1, setWeaponChoice1] = React.useState<Weapon>(equipment[0].choices[1].weapons[0])
  const handleChoice1Change = (weapon: Weapon) => {
    setWeaponChoice1(weapon);
    equipment[0].choices[1].weapons[0] = weapon;
  }

  return (
    <div>
      <ABSwitch
        labels={['A light crossbow & 20 bolts', 'A simple weapon']}
        onChange={handleChoice1}
      />
      <WeaponSelection
        weaponTypes={[WeaponType.Simple]}
        weapon={weaponChoice1}
        onChange={handleChoice1Change}
      />
    </div>
  )
}

export default SorcererChoices;
