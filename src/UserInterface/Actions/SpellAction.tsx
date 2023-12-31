import React from 'react';
import styles from './ActionBar.module.scss';
import Spell from '../../Character/Actions/Spells/Spell';
import Creature from '../../Character/Creature';
import { R } from '../../Character/Actions/Spells/Spells';

type PropsType<T> = {
  character: Creature,
  spell: R<Spell>,
}

const SpellAction = <T extends Spell>({
  character,
  spell,
}: PropsType<T>) => {
  const handleClick = () => {
    character.action = new spell.spell();
  }

  return (
    <div className={styles.action} onClick={handleClick}>{spell.name}</div>
  )
}

export default SpellAction;
