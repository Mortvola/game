import React from 'react';
import styles from './ActionBar.module.scss';
import Creature from '../../Character/Creature';

type PropsType = {
  character: Creature,
}

const RangeAction: React.FC<PropsType> = ({
  character,
}) => {
  const handleClick = () => {
    character.primaryWeapon = 'Range';
  }

  return (
    <div className={styles.action} onClick={handleClick}>Range</div>
  )
}

export default RangeAction;
