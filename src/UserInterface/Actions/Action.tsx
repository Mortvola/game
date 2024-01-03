import React from 'react';
import styles from './ActionBar.module.scss';
import ActionClass from '../../Character/Actions/Action';
import Creature from '../../Character/Creature';
import { A } from '../../Character/Actions/Actions';

type PropsType = {
  character: Creature,
  action: A<ActionClass>,
}

const Action: React.FC<PropsType> = ({
  character,
  action,
}) => {
  const isAvailable = (): boolean => {
    return (
      ((action.time === 'Action' && character.actionsLeft > 0)
      || (action.time === 'Bonus' && character.bonusActionsLeft > 0))
    )
  }

  const handleClick = () => {
    if (isAvailable()) {
      character.setAction(new action.action());
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
