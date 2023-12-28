import React from 'react';
import styles from './ActionBar.module.scss';
import Creature from '../../Character/Creature';

type PropsType = {
  character: Creature,
}

const MeleeAction: React.FC<PropsType> = ({
  character,
}) => {
  const handleClick = () => {
    character.primaryWeapon = 'Melee';
  }

  return (
    <div className={styles.action} onClick={handleClick}>Melee</div>
  )
}

export default MeleeAction;
