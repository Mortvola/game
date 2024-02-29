import React from 'react';
import styles from './ActionBar.module.scss';
import { rangeAttack } from '../../Character/Actions/RangeAttack';
import { CreatureActorInterface } from '../../types';

type PropsType = {
  actor: CreatureActorInterface,
}

const RangeAction: React.FC<PropsType> = ({
  actor,
}) => {
  const isAvailable = (): boolean => (
    actor.character.actionsLeft > 0
  )

  const handleClick = () => {
    if (isAvailable()) {
      actor.setAction(rangeAttack);
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
