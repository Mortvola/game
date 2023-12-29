import React from 'react';
import styles from './ActionBar.module.scss';
import Spell from '../../Character/Spells/Spell';
import Creature from '../../Character/Creature';

type PropsType = {
  character: Creature,
  spell: Spell,
}

const SpellAction: React.FC<PropsType> = ({
  character,
  spell,
}) => {
  const handleClick = () => {
    character.action = spell;
  }

  return (
    <div className={styles.action} onClick={handleClick}>{spell.name}</div>
  )
}

export default SpellAction;
