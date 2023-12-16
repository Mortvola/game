import React from 'react';
import styles from './StartingEquipment.module.scss';

type PropsType = {
  children: React.ReactNode[],
}

const WeaponSelectionWrapper: React.FC<PropsType> = ({
  children,
}) => (
  <div className={styles.choiceWrapper}>
    <div className={styles.test} style={{ gridTemplateColumns: `repeat(${children.length ?? 0}, 1fr)` }}>
      { children }
    </div>
  </div>
)

export default WeaponSelectionWrapper;
