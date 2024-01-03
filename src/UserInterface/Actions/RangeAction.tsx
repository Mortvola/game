import React from 'react';
import styles from './ActionBar.module.scss';
import Creature from '../../Character/Creature';
import RangeAttack from '../../Character/Actions/RangeAttack';

type PropsType = {
  character: Creature,
}

const RangeAction: React.FC<PropsType> = ({
  character,
}) => {
  const isAvailable = (): boolean => (
    character.actionsLeft > 0
  )

  const handleClick = () => {
    if (isAvailable()) {
      character.setAction(new RangeAttack());
    }

    character.primaryWeapon = 'Range';
  }

  let  className = styles.action;

  if (!isAvailable()) {
    className = `${className} ${styles.disabled}`
  }

  return (
    <div className={className} onClick={handleClick}>Range</div>
  )
}

export default RangeAction;
