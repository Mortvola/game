import React from 'react';
import styles from './ActionBar.module.scss';
import Creature from '../../Character/Creature';
import MeleeAttack from '../../Character/Actions/MeleeAttack';

type PropsType = {
  character: Creature,
}

const MeleeAction: React.FC<PropsType> = ({
  character,
}) => {
  const handleClick = () => {
    character.action = new MeleeAttack();
  }

  return (
    <div className={styles.action} onClick={handleClick}>Melee</div>
  )
}

export default MeleeAction;
