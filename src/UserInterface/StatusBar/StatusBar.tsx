import React from 'react';
import Character from '../../Character/Character';
import styles from './StatusBar.module.scss';

type PropsType = {
  character: Character,
}

const StatusBar: React.FC<PropsType> = ({
  character,
}) => (
  <div className={styles.statusbar}>
    <div className={`${styles.action} ${character.actionsLeft <= 0 ? styles.unavailable : ''}`}></div>
    <div className={`${styles.bonus} ${character.bonusActionsLeft <= 0 ? styles.unavailable : ''}`}></div>
  </div>
)

export default StatusBar;
