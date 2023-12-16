import React from 'react';
import Weapon, { WeaponName, WeaponType, getWeapon, weapons } from '../../Character/Equipment/Weapon';

type PropsType = {
  weaponTypes: WeaponType[],
  weapon: Weapon,
  onChange: (weapon: Weapon) => void,
}

const WeaponSelection: React.FC<PropsType> = ({
  weaponTypes,
  weapon,
  onChange,
}) => {
  const [weaponChoice, setWeaponChoice] = React.useState<Weapon>(weapon)
  const handleChoice2Change: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const weapon = getWeapon(event.target.value as WeaponName)
    setWeaponChoice(weapon!);
    onChange(weapon!)
  }

  return (
    <select value={weaponChoice.name} onChange={handleChoice2Change}>
      {
        weapons
          .filter((w) => weaponTypes.includes(w.type))
          .map((w) => (
            <option value={w.name}>{w.name}</option>
          ))
      }
    </select>
  )
}

export default WeaponSelection;
