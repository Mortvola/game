import React from 'react';
import ABSwitch from '../ABSwitch';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';
import Weapon, { WeaponName, WeaponType, getWeapon, weapons } from '../../Character/Equipment/Weapon';
import WeaponSelection from './WeaponSelection';

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

  const [weaponChoice, setWeaponChoice] = React.useState<Weapon>(equipment[1].choices[0].weapons[0])
  const handleChoice1Change = (weapon: Weapon) => {
    setWeaponChoice(weapon);
    equipment[1].choices[0].weapons[0] = weapon;
  }

  const [weaponChoice2, setWeaponChoice2] = React.useState<Weapon>(equipment[1].choices[1].weapons[0])
  const handleChoice2Change = (weapon: Weapon) => {
    setWeaponChoice2(weapon);
    equipment[1].choices[1].weapons[0] = weapon;
  }

  const [weaponChoice3, setWeaponChoice3] = React.useState<Weapon>(equipment[1].choices[1].weapons[1])
  const handleChoice3Change = (weapon: Weapon) => {
    setWeaponChoice3(weapon);
    equipment[1].choices[1].weapons[1] = weapon;
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
      <WeaponSelection
        weaponTypes={[WeaponType.Martial, WeaponType.MartialRange]}
        weapon={weaponChoice}
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
        labels={['A light crossbow & 20 bolts', 'Two handaxes']}
        value={equipment[2].selection}
        onChange={handleChoice3}
      />
    </div>
  )
}

export default FighterChoices;
