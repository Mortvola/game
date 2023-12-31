import React from 'react';
import styles from './ActionBar.module.scss';
import Creature from '../../Character/Creature';
import RangeAttack from '../../Character/Actions/RangeAttack';

type PropsType = {
  character: Creature,
}

const RangeAction: React.FC<PropsType> = ({
  character,
}) => {
  const handleClick = () => {
    character.action = new RangeAttack();
  }

  return (
    <div className={styles.action} onClick={handleClick}>Range</div>
  )
}

export default RangeAction;
