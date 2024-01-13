import React from 'react';
import styles from './ActionBar.module.scss';
import { A, ActionInterface, CreatureActorInterface } from '../../types';

type PropsType = {
  actor: CreatureActorInterface,
  action: A<ActionInterface>,
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
      actor.setAction(new action.action(actor));
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
