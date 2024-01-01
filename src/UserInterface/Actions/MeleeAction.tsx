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
    if (character.actionsLeft > 0) {
      character.action = new MeleeAttack();
    }

    character.primaryWeapon = 'Melee';
  }

  const handleFocus: React.FocusEventHandler<HTMLDivElement> = (event) => {
    event.target.blur();
  }

  return (
    <div className={styles.action} onClick={handleClick} onFocus={handleFocus}>Melee</div>
  )
}

export default MeleeAction;
