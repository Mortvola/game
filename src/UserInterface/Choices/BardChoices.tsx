import React from 'react';
import ABSwitch from '../ABSwitch';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';
import WeaponSelection from './WeaponSelection';
import Weapon, { WeaponType } from '../../Character/Equipment/Weapon';

type PropsType = {
  equipment: EquipmentChoices[],
}

const BardChoices: React.FC<PropsType> = ({
  equipment,
}) => {
  const handleChoice1 = (value: number) => {
    equipment[0].selection = value;
  }

  const [weaponChoice, setWeaponChoice] = React.useState<Weapon>(equipment[0].choices[2].weapons[0])
  const handleChoice1Change = (weapon: Weapon) => {
    setWeaponChoice(weapon);
    equipment[0].choices[2].weapons[0] = weapon;
  }

  return (
    <div>
      <ABSwitch
        labels={['A rapier', 'A Longsword', 'A simple weapon']}
        onChange={handleChoice1}
      />
      <WeaponSelection
        weaponTypes={[WeaponType.Simple, WeaponType.SimpleRange]}
        weapon={weaponChoice}
        onChange={handleChoice1Change}
      />
    </div>
  )
}

export default BardChoices;
