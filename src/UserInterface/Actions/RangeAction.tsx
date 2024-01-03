import React from 'react';
import styles from './ActionBar.module.scss';
import Creature from '../../Character/Creature';
import RangeAttack from '../../Character/Actions/RangeAttack';
import Actor from '../../Character/Actor';

type PropsType = {
  actor: Actor,
}

const RangeAction: React.FC<PropsType> = ({
  actor,
}) => {
  const isAvailable = (): boolean => (
    actor.character.actionsLeft > 0
  )

  const handleClick = () => {
    if (isAvailable()) {
      actor.setAction(new RangeAttack());
    }

    actor.character.primaryWeapon = 'Range';
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
