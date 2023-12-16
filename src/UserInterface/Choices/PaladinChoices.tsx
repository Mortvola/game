import React from 'react';
import ABSwitch from '../ABSwitch';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';
import WeaponSelection from './WeaponSelection';
import Weapon, { WeaponType } from '../../Character/Equipment/Weapon';

type PropsType = {
  equipment: EquipmentChoices[],
}

const PaladinChoices: React.FC<PropsType> = ({
  equipment,
}) => {
  const handleChoice1 = (value: number) => {
    equipment[0].selection = value;
  }

  const handleChoice2 = (value: number) => {
    equipment[1].selection = value;
  }

  const [weaponChoice1, setWeaponChoice1] = React.useState<Weapon>(equipment[0].choices[0].weapons[0])
  const handleChoice1Change = (weapon: Weapon) => {
    setWeaponChoice1(weapon);
    equipment[0].choices[0].weapons[0] = weapon;
  }

  const [weaponChoice2, setWeaponChoice2] = React.useState<Weapon>(equipment[0].choices[1].weapons[0])
  const handleChoice2Change = (weapon: Weapon) => {
    setWeaponChoice2(weapon);
    equipment[0].choices[1].weapons[0] = weapon;
  }

  const [weaponChoice3, setWeaponChoice3] = React.useState<Weapon>(equipment[0].choices[1].weapons[1])
  const handleChoice3Change = (weapon: Weapon) => {
    setWeaponChoice3(weapon);
    equipment[0].choices[1].weapons[1] = weapon;
  }


  const [weaponChoice4, setWeaponChoice4] = React.useState<Weapon>(equipment[1].choices[1].weapons[0])
  const handleChoice4Change = (weapon: Weapon) => {
    setWeaponChoice4(weapon);
    equipment[1].choices[1].weapons[0] = weapon;
  }

  return (
    <div>
      <ABSwitch
        labels={['A martial weapon & shield', 'Two martial weapons']}
        onChange={handleChoice1}
      />
      <WeaponSelection
        weaponTypes={[WeaponType.Martial, WeaponType.MartialRange]}
        weapon={weaponChoice1}
        onChange={handleChoice1Change}
      />
      <WeaponSelection
        weaponTypes={[WeaponType.Martial, WeaponType.MartialRange]}
        weapon={weaponChoice2}
        onChange={handleChoice2Change}
      />
      <WeaponSelection
        weaponTypes={[WeaponType.Martial, WeaponType.MartialRange]}
        weapon={weaponChoice3}
        onChange={handleChoice3Change}
      />
      <ABSwitch
        labels={['Five javelins', 'A simple melee weapon']}
        onChange={handleChoice2}
      />
      <WeaponSelection
        weaponTypes={[WeaponType.Simple]}
        weapon={weaponChoice4}
        onChange={handleChoice4Change}
      />
    </div>
  )
}

export default PaladinChoices;
