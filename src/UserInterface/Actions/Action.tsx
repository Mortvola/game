import React from 'react';
import styles from './ActionBar.module.scss';
import ActionClass from '../../Character/Actions/Action';
import Creature from '../../Character/Creature';
import { A } from '../../Character/Actions/Actions';
import Actor from '../../Character/Actor';

type PropsType = {
  actor: Actor,
  action: A<ActionClass>,
}

const Action: React.FC<PropsType> = ({
  actor,
  action,
}) => {
  const isAvailable = (): boolean => {
    return (
      ((action.time === 'Action' && actor.character.actionsLeft > 0)
      || (action.time === 'Bonus' && actor.character.bonusActionsLeft > 0))
    )
  }

  const handleClick = () => {
    if (isAvailable()) {
      actor.setAction(new action.action());
    }
  }

  let className = styles.action;
  if (action.time === 'Bonus') {
    className = `${className} ${styles.bonus}`;
  }

  if (!isAvailable()) {
    className = `${className} ${styles.disabled}`
  }

  return (
    <div
      className={className}
      onClick={handleClick}
    >
      {action.name}
    </div>
  )
}

export default Action;
