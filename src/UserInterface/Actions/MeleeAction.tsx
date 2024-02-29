import React from 'react';
import styles from './ActionBar.module.scss';
import { meleeAttack } from '../../Character/Actions/MeleeAttack';
import { CreatureActorInterface } from '../../types';
import { observer } from 'mobx-react-lite';

type PropsType = {
  actor: CreatureActorInterface,
}

const MeleeAction: React.FC<PropsType> = observer(({
  actor,
}) => {
  const isAvailable = (): boolean => (
    actor.character.equipped.meleeWeapon !== null
    && actor.character.actionsLeft > 0
  )

  const handleClick = () => {
    if (isAvailable()) {
      actor.setAction(meleeAttack);
    }
  }

  let  className = styles.action;

  if (!isAvailable()) {
    className = `${className} ${styles.disabled}`
  }
  else if (actor.getAction() === meleeAttack) {
    className = `${className} ${styles.selected}`
  }

  return (
    <div className={className} onClick={handleClick}>Melee</div>
  )
})

export default MeleeAction;
