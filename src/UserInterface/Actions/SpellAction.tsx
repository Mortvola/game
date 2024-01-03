import React from 'react';
import styles from './ActionBar.module.scss';
import Spell from '../../Character/Actions/Spells/Spell';
import Creature from '../../Character/Creature';
import { R } from '../../Character/Actions/Spells/Spells';

type PropsType = {
  character: Creature,
  spell: R<Spell>,
}

const SpellAction: React.FC<PropsType> = ({
  character,
  spell,
}) => {
  const isAvailable = (): boolean => {
    return (
      ((spell.time === 'Action' && character.actionsLeft > 0)
      || (spell.time === 'Bonus' && character.bonusActionsLeft > 0))
      && character.spellSlots[spell.level - 1] > 0
    )
  }

  const handleClick = () => {
    if (isAvailable()) {
      character.setAction(new spell.spell());
    }
  }

  let className = styles.action;
  if (spell.time === 'Bonus') {
    className = `${className} ${styles.bonus}`;
  }

  if (!isAvailable()) {
    className = `${className} ${styles.disabled}`
  }

  return (
    <div
      className={className}
      onClick={handleClick}
    >
      {spell.name}
    </div>
  )
}

export default SpellAction;
