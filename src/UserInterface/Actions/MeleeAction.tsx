import React from 'react';
import styles from './ActionBar.module.scss';
import MeleeAttack from '../../Character/Actions/MeleeAttack';
import Actor from '../../Character/Actor';

type PropsType = {
  actor: Actor,
}

const MeleeAction: React.FC<PropsType> = ({
  actor,
}) => {
  const isAvailable = (): boolean => (
    actor.character.actionsLeft > 0
  )

  const handleClick = () => {
    if (isAvailable()) {
      actor.setAction(new MeleeAttack());
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
