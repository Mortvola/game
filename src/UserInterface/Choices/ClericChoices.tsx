import React from 'react';
import ABSwitch from '../ABSwitch';
import WeaponSelection from './WeaponSelection';
import Weapon, { WeaponType } from '../../Character/Equipment/Weapon';
import { EquipmentChoices } from '../../Character/Classes/CharacterClass';

type PropsType = {
  equipment: EquipmentChoices[],
}

const ClericChoices: React.FC<PropsType> = ({
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

  const [weaponChoice, setWeaponChoice] = React.useState<Weapon>(equipment[2].choices[1].weapons[0])
  const handleChoice1Change = (weapon: Weapon) => {
    setWeaponChoice(weapon);
    equipment[2].choices[1].weapons[0] = weapon;
  }

  return (
    <div>
      <ABSwitch
        labels={['A mace', 'A warhammer']}
        onChange={handleChoice1}
      />
      <ABSwitch
        labels={['Scale mail', 'Leather armor', 'Chain mail']}
        onChange={handleChoice2}
      />
      <ABSwitch
        labels={['A light crossbow & 20 bolts', 'A simple weapon']}
        onChange={handleChoice3}
      />
      <WeaponSelection
        weaponTypes={[WeaponType.Simple, WeaponType.SimpleRange]}
        weapon={weaponChoice}
        onChange={handleChoice1Change}
      />
    </div>
  )
}

export default ClericChoices;
