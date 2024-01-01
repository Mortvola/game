import React from 'react';
import styles from './ActionBar.module.scss';
import Creature from '../../Character/Creature';
import MeleeAttack from '../../Character/Actions/MeleeAttack';

type PropsType = {
  character: Creature,
}

const MeleeAction: React.FC<PropsType> = ({
  character,
}) => {
  const isAvailable = (): boolean => (
    character.actionsLeft > 0
  )

  const handleClick = () => {
    if (isAvailable()) {
      character.action = new MeleeAttack();
    }

    character.primaryWeapon = 'Melee';
  }

  let  className = styles.action;

  if (!isAvailable()) {
    className = `${className} ${styles.disabled}`
  }

  return (
    <div className={className} onClick={handleClick}>Melee</div>
  )
}

export default MeleeAction;
