import React from 'react';
import { CharacterInterface, SpellFactory } from '../../types';
import styles from './StatusBar.module.scss';

type PropsType = {
  character: CharacterInterface,
}

const SpellSlots: React.FC<PropsType> = ({ character }) => {
  const spellSlots = () => {
    const slots: React.ReactNode[] = [];

    const level = (character.actor?.getAction() as SpellFactory)?.level

    const available = character.spellSlots[0]
    const maxSlots = character.getMaxSpellSlots(1)!

    for (let i = 0; i < maxSlots; i += 1) {
      let className = '';
      if (i > available - 1) {
        className += ` ${styles.unavailable}`
      }
      else if (level === 1 && i === available - 1) {
        className += ` ${styles.pulse}`
      }

      slots.push(<div key={i} className={className} />)
    }

    return slots;
  }

  return (
    <div className={styles.slots}>
      {
        spellSlots()
      }
    </div>
  )
}

export default SpellSlots;