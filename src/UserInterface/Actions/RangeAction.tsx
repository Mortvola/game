import React from 'react';
import styles from './ActionBar.module.scss';
import Creature from '../../Character/Creature';
import RangeAttack from '../../Character/Actions/RangeAttack';
import { WeaponType } from '../../Character/Equipment/Weapon';

type PropsType = {
  character: Creature,
}

const RangeAction: React.FC<PropsType> = ({
  character,
}) => {
  const handleClick = () => {
    if (character.actionsLeft > 0) {
      character.action = new RangeAttack();
    }

    character.primaryWeapon = 'Range';
  }

  const handleFocus: React.FocusEventHandler<HTMLDivElement> = (event) => {
    event.target.blur();
  }

  return (
    <div className={styles.action} onClick={handleClick} onFocus={handleFocus}>Range</div>
  )
}

export default RangeAction;
