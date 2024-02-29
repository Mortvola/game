import React from 'react';
import styles from './ActionBar.module.scss';
import { rangeAttack } from '../../Character/Actions/RangeAttack';
import { CreatureActorInterface } from '../../types';
import { observer } from 'mobx-react-lite';

type PropsType = {
  actor: CreatureActorInterface,
}

const RangeAction: React.FC<PropsType> = observer(({
  actor,
}) => {
  const isAvailable = (): boolean => (
    actor.character.equipped.rangeWeapon !== null
    && actor.character.actionsLeft > 0
  )

  const handleClick = () => {
    if (isAvailable()) {
      actor.setAction(rangeAttack);
    }
  }

  let  className = styles.action;

  if (!isAvailable()) {
    className = `${className} ${styles.disabled}`
  }
  else if (actor.getAction() === rangeAttack) {
    className = `${className} ${styles.selected}`
  }

  return (
    <div className={className} onClick={handleClick}>Range</div>
  )
})

export default RangeAction;
