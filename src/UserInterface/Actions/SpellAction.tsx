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
    if (
      ((spell.time === 'Action' && character.actionsLeft > 0)
      || (spell.time === 'Bonus' && character.bonusActionsLeft > 0))
      && character.spellSlots[spell.level - 1] > 0
    ) {
      character.action = new spell.spell();
    }
  }

  return (
    <div
      className={`${styles.action}
      ${spell.time === 'Bonus' ? styles.bonus : ''}`}
      onClick={handleClick}
    >
      {spell.name}
    </div>
  )
}

export default SpellAction;
