import React from 'react';
import styles from './ActionBar.module.scss';
import { A, ActionFactory, ActionInterface, CreatureActorInterface } from '../../types';
import { observer } from 'mobx-react-lite';

type PropsType = {
  actor: CreatureActorInterface,
  action: ActionFactory<ActionInterface>,
}

const Action: React.FC<PropsType> = observer(({
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
      actor.setAction(action);
    }
  }

  let className = styles.action;
  if (action.time === 'Bonus') {
    className = `${className} ${styles.bonus}`;
  }

  if (!isAvailable()) {
    className = `${className} ${styles.disabled}`
  }
  else if (actor.getAction() === action) {
    className = `${className} ${styles.selected}`
  }

  return (
    <div
      className={className}
      onClick={handleClick}
    >
      {action.name}
    </div>
  )
})

export default Action;
