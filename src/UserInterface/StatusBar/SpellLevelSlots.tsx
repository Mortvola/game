import React from 'react';
import styles from './StatusBar.module.scss';

type PropsType = {
  level: number,
  maxSpellSlots: number,
  available: number,
}

const SpellLevelSlots: React.FC<PropsType> = ({ level, maxSpellSlots, available }) => {
  const elements: React.ReactNode[] = []

  for (let i = 0; i < maxSpellSlots; i += 1) {
    let className = '';
    if (i > available - 1) {
      className += ` ${styles.unavailable}`
    }
    else if (level === 1 && i === available - 1) {
      className += ` ${styles.pulse}`
    }

    elements.push(
      <div key={i} className={className} />
    )
  }

  return (
    <div className={styles.slots}>
      {
        elements
      }
    </div>
  )
}

export default SpellLevelSlots;

