import React from 'react';
import styles from './ActionBar.module.scss';
import { meleeAttack } from '../../Character/Actions/MeleeAttack';
import { CreatureActorInterface } from '../../types';

type PropsType = {
  actor: CreatureActorInterface,
}

const MeleeAction: React.FC<PropsType> = ({
  actor,
}) => {
  const isAvailable = (): boolean => (
    actor.character.actionsLeft > 0
  )

  const handleClick = () => {
    if (isAvailable()) {
      actor.setAction(meleeAttack);
    }

    actor.character.primaryWeapon = 'Melee';
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
