import React from 'react';
import styles from './StatusBar.module.scss';
import { CharacterInterface } from '../../types';

type PropsType = {
  character: CharacterInterface,
}

const StatusBar: React.FC<PropsType> = ({
  character,
}) => {
  const spellSlots = () => {
    const slots: React.ReactNode[] = [];

    const available = character.spellSlots[0]

    for (let i = 0; i < character.getMaxSpellSlots(1)!; i += 1) {
      slots.push(<div key={i} className={i < available ? '' : styles.unavailable}></div>)
    }

    return slots;
  }

  return (
    <div className={styles.statusbar}>
      <div className={`${styles.action} ${character.actionsLeft <= 0 ? styles.unavailable : ''}`}></div>
      <div className={`${styles.bonus} ${character.bonusActionsLeft <= 0 ? styles.unavailable : ''}`}></div>
      <div>
        <div className={styles.slots}>
          {
            spellSlots()
          }
        </div>
      </div>
    </div>
  )
}

export default StatusBar;
