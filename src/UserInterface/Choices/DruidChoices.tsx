import React from 'react';
import ABSwitch from '../ABSwitch';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';
import WeaponSelection from './WeaponSelection';
import Weapon, { WeaponType } from '../../Character/Equipment/Weapon';

type PropsType = {
  equipment: EquipmentChoices[],
}

const DruidChoices: React.FC<PropsType> = ({
  equipment,
}) => {
  const handleChoice1 = (value: number) => {
    equipment[0].selection = value;
  }

  const handleChoice2 = (value: number) => {
    equipment[1].selection = value;
  }

  const [weaponChoice1, setWeaponChoice1] = React.useState<Weapon>(equipment[0].choices[1].weapons[0])
  const handleChoice1Change = (weapon: Weapon) => {
    setWeaponChoice1(weapon);
    equipment[0].choices[1].weapons[0] = weapon;
  }

  const [weaponChoice2, setWeaponChoice2] = React.useState<Weapon>(equipment[1].choices[1].weapons[0])
  const handleChoice2Change = (weapon: Weapon) => {
    setWeaponChoice2(weapon);
    equipment[1].choices[1].weapons[0] = weapon;
  }

  return (
    <div>
      <ABSwitch
        labels={['A wooden shield', 'A simple weapon']}
        onChange={handleChoice1}
      />
      <WeaponSelection
        weaponTypes={[WeaponType.Simple, WeaponType.SimpleRange]}
        weapon={weaponChoice1}
        onChange={handleChoice1Change}
      />
      <ABSwitch
        labels={['A scimitar', 'A simple melee weapon']}
        onChange={handleChoice2}
      />
      <WeaponSelection
        weaponTypes={[WeaponType.Simple]}
        weapon={weaponChoice2}
        onChange={handleChoice2Change}
      />
    </div>
  )
}

export default DruidChoices;
