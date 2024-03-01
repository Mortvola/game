import React from 'react';
import styles from './StatusBar.module.scss';
import { CharacterInterface } from '../../types';
import SpellSlots from './SpellSlots';
import { observer } from 'mobx-react-lite';

type PropsType = {
  character: CharacterInterface,
}

const StatusBar: React.FC<PropsType> = observer(({
  character,
}) => {
  let actionClass = styles.action;
  if (character.actionsLeft <= 0) {
    actionClass = `${actionClass} ${styles.unavailable}`
  }
  else if (character.actor?.getAction()?.time === 'Action') {
    actionClass = `${actionClass} ${styles.pulse}`
  }

  let bonusClass = styles.bonus;
  if (character.bonusActionsLeft <= 0) {
    bonusClass = `${bonusClass} ${styles.unavailable}`
  }
  else if (character.actor?.getAction()?.time === 'Bonus') {
    bonusClass = `${bonusClass} ${styles.pulse}`
  }

  return (
    <div className={styles.statusbar}>
      <div className={actionClass}></div>
      <div className={bonusClass}></div>
      <div>
        <SpellSlots character={character} />
      </div>
    </div>
  )
})

export default StatusBar;
