import React from 'react';
import Weapon, { WeaponName, WeaponType, getWeapon, weapons as weaponList } from '../../Character/Equipment/Weapon';
import styles from './StartingEquipment.module.scss';

type PropsType = {
  weaponTypes: WeaponType[],
  weapons: Weapon[],
  index: number,
}

const WeaponSelection: React.FC<PropsType> = ({
  weaponTypes,
  weapons,
  index,
}) => {
  const [weaponChoice2, setWeaponChoice2] = React.useState<Weapon>(weapons[index])
  const handleChoiceChange2: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const weapon = getWeapon(event.target.value as WeaponName)
    setWeaponChoice2(weapon);
    weapons[index] = weapon;
  }

  return (
    <select className={styles.selector} value={weaponChoice2.name} onChange={handleChoiceChange2}>
      {
        weaponList
          .filter((w) => weaponTypes.includes(w.type))
          .map((w) => (
            <option value={w.name}>{w.name}</option>
          ))
      }
    </select>
  )
}

export default WeaponSelection;
